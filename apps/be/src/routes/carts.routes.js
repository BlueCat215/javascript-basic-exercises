const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const carts = new JsonCollection("carts.json");
function withImage(product) {
  const images = Array.isArray(product.images) ? product.images : [];
  const stock = product.stock ?? 0;
  return {
    ...product,
    images,
    image: images[0] ?? "",
    stock,
    inStock: stock > 0,
  };
}
const productsCollection = new JsonCollection("products.json");

// Bổ sung thông tin sản phẩm vào từng item trong giỏ hàng.
async function enrichCart(cart) {
  if (!cart) return null;

  const allProducts = await productsCollection.findAll();
  const productMap = new Map(allProducts.map((p) => [p.id, p]));

  const products = (cart.products || []).map((item) => {
    const raw = productMap.get(Number(item.productId)) || null;
    const product = raw ? withImage(raw) : null;
    return { ...item, product };
  });

  return { ...cart, products };
}

// Tìm giỏ hàng đang hoạt động của user, nếu chưa có thì tạo mới.
async function findOrCreateActiveCart(userId) {
  const all = await carts.findAll();
  const targetUserId = Number(userId);

  let active = all.find(
    (c) => Number(c.userId) === targetUserId && c.status === "active",
  );

  if (!active) {
    active = await carts.create({
      userId: targetUserId,
      status: "active",
      products: [],
      date: new Date().toISOString(),
    });
  }

  return active;
}

// Lấy giỏ hàng đang dùng của user hiện tại.
router.get("/active", authenticateToken, async (req, res) => {
  try {
    const active = await findOrCreateActiveCart(req.user.id);
    const enriched = await enrichCart(active);

    res.json(enriched);
  } catch (error) {
    console.error("Error fetching active cart:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi tải giỏ hàng",
    });
  }
});

// Thêm sản phẩm vào giỏ hàng.
router.post("/active/items", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Thiếu productId" });
    }

    const targetProductId = Number(productId);
    const active = await findOrCreateActiveCart(req.user.id);

    // Nếu sản phẩm đã có thì tăng số lượng.
    const existing = active.products.find(
      (p) => Number(p.productId) === targetProductId,
    );

    const newProducts = existing
      ? active.products.map((p) =>
          Number(p.productId) === targetProductId
            ? { ...p, quantity: p.quantity + Number(quantity) }
            : p,
        )
      : [
          ...active.products,
          {
            productId: targetProductId,
            quantity: Number(quantity),
          },
        ];

    const updated = await carts.updateById(
      active.id,
      { products: newProducts },
      { replace: false },
    );

    res.json(await enrichCart(updated));
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi thêm sản phẩm",
    });
  }
});

// Cập nhật số lượng sản phẩm trong giỏ.
router.patch(
  "/active/items/:productId",
  authenticateToken,
  async (req, res) => {
    try {
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({ message: "Thiếu quantity" });
      }

      const active = await findOrCreateActiveCart(req.user.id);
      const productId = Number(req.params.productId);

      const newProducts = active.products.map((p) =>
        Number(p.productId) === productId
          ? { ...p, quantity: Math.max(1, Number(quantity)) }
          : p,
      );

      const updated = await carts.updateById(
        active.id,
        { products: newProducts },
        { replace: false },
      );

      res.json(await enrichCart(updated));
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({
        message: "Lỗi hệ thống khi cập nhật số lượng",
      });
    }
  },
);

// Xóa một sản phẩm khỏi giỏ hàng.
router.delete(
  "/active/items/:productId",
  authenticateToken,
  async (req, res) => {
    try {
      const active = await findOrCreateActiveCart(req.user.id);
      const productId = Number(req.params.productId);

      const newProducts = active.products.filter(
        (p) => Number(p.productId) !== productId,
      );

      const updated = await carts.updateById(
        active.id,
        { products: newProducts },
        { replace: false },
      );

      res.json(await enrichCart(updated));
    } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).json({
        message: "Lỗi hệ thống khi xóa sản phẩm",
      });
    }
  },
);

// Xóa toàn bộ sản phẩm trong giỏ hàng.
router.delete("/active", authenticateToken, async (req, res) => {
  try {
    const active = await findOrCreateActiveCart(req.user.id);

    const updated = await carts.updateById(
      active.id,
      { products: [] },
      { replace: false },
    );

    res.json(await enrichCart(updated));
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi làm trống giỏ hàng",
    });
  }
});

// Lấy danh sách giỏ hàng, hỗ trợ limit và sort.
router.get("/", async (req, res) => {
  try {
    let items = await carts.findAll();
    const { limit, sort } = req.query;

    if (sort === "asc") {
      items = [...items].sort((a, b) => a.id - b.id);
    }

    if (sort === "desc") {
      items = [...items].sort((a, b) => b.id - a.id);
    }

    if (limit) {
      items = items.slice(0, Number(limit));
    }

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// Lấy tất cả giỏ hàng của một user.
router.get("/user/:userId", async (req, res) => {
  try {
    const allCarts = await carts.findAll();

    const items = allCarts.filter(
      (c) => Number(c.userId) === Number(req.params.userId),
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// Lấy một giỏ hàng theo ID.
router.get("/:id", async (req, res) => {
  try {
    const item = await carts.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// Tạo giỏ hàng mới.
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { userId, products: cartProducts, date } = req.body;

    if (!userId || !Array.isArray(cartProducts)) {
      return res.status(400).json({
        message: "Thiếu userId hoặc products",
      });
    }

    const newCart = await carts.create({
      userId: Number(userId),
      date: date || new Date().toISOString(),
      products: cartProducts.map((p) => ({
        productId: Number(p.productId),
        quantity: Number(p.quantity),
      })),
    });

    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// Cập nhật toàn bộ thông tin giỏ hàng.
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await carts.updateById(req.params.id, req.body, {
      replace: true,
    });

    if (!updated) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// Cập nhật một phần thông tin giỏ hàng.
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await carts.updateById(req.params.id, req.body, {
      replace: false,
    });

    if (!updated) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// Xóa giỏ hàng theo ID.
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await carts.deleteById(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }

    res.json(deleted);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

module.exports = router;
