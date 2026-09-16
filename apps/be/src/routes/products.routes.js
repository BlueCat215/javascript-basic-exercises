const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const products = new JsonCollection("products.json");

// Chuẩn hóa dữ liệu sản phẩm từ nhiều cách đặt tên khác nhau.
function normalizeRow(row) {
  const normalized = {};

  Object.keys(row).forEach((key) => {
    normalized[key.trim().toLowerCase()] = row[key];
  });

  const pick = (...candidates) => {
    for (const c of candidates) {
      if (normalized[c] !== undefined && normalized[c] !== "") {
        return normalized[c];
      }
    }
    return undefined;
  };

  return {
    title: pick("title", "tên", "tên sản phẩm", "name", "product name"),
    price: pick("price", "giá", "giá bán"),
    category: pick("category", "danh mục", "category name"),
    image: pick("image", "ảnh", "hình ảnh", "image url"),
    description: pick("description", "mô tả"),
  };
}

// Lấy danh sách sản phẩm, hỗ trợ tìm kiếm, lọc, sắp xếp và phân trang.
router.get("/", async (req, res) => {
  let items = await products.findAll();

  const {
    q,
    category,
    minPrice,
    maxPrice,
    brand,
    minRating,
    isNew,
    isBestSeller,
    onSale,
    sort,
    page = 1,
    pageSize = 12,
  } = req.query;

  // Tìm kiếm theo tên sản phẩm.
  if (q) {
    items = items.filter((p) =>
      p.title.toLowerCase().includes(q.toLowerCase()),
    );
  }

  // Lọc theo danh mục và khoảng giá.
  if (category) items = items.filter((p) => p.category === category);
  if (minPrice) items = items.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) items = items.filter((p) => p.price <= Number(maxPrice));

  // Lọc theo nhiều thương hiệu.
  if (brand) {
    const brandList = brand.split(",");
    items = items.filter((p) => brandList.includes(p.brand));
  }

  // Lọc theo đánh giá và trạng thái sản phẩm.
  if (minRating) {
    items = items.filter((p) => (p.rating?.rate || 0) >= Number(minRating));
  }

  if (isNew === "true") items = items.filter((p) => p.isNew);
  if (isBestSeller === "true") items = items.filter((p) => p.isBestSeller);

  // Lọc sản phẩm đang giảm giá.
  if (onSale === "true") {
    items = items.filter((p) => p.originalPrice && p.originalPrice > p.price);
  }

  // Tính tỷ lệ giảm giá.
  const getDiscountPercent = (p) =>
    p.originalPrice && p.originalPrice > p.price
      ? (p.originalPrice - p.price) / p.originalPrice
      : 0;

  // Sắp xếp sản phẩm.
  if (sort === "price_asc") {
    items = [...items].sort((a, b) => a.price - b.price);
  }

  if (sort === "price_desc") {
    items = [...items].sort((a, b) => b.price - a.price);
  }

  if (sort === "newest") {
    items = [...items].sort((a, b) => b.id - a.id);
  }

  if (sort === "discount_desc") {
    items = [...items].sort(
      (a, b) => getDiscountPercent(b) - getDiscountPercent(a),
    );
  }

  if (sort === "rating_desc") {
    items = [...items].sort(
      (a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0),
    );
  }

  // Phân trang kết quả.
  const total = items.length;
  const pageNum = Number(page);
  const sizeNum = Number(pageSize);

  const paginated = items.slice((pageNum - 1) * sizeNum, pageNum * sizeNum);

  res.json({
    items: paginated,
    total,
    page: pageNum,
    pageSize: sizeNum,
    totalPages: Math.ceil(total / sizeNum),
  });
});

// Lấy danh sách danh mục sản phẩm.
router.get("/categories", async (req, res) => {
  try {
    const items = await products.findAll();

    const categories = [
      ...new Set(items.map((p) => p.category).filter(Boolean)),
    ];

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi lấy danh mục",
    });
  }
});

// Lấy sản phẩm theo danh mục.
router.get("/category/:categoryName", async (req, res) => {
  try {
    const { limit } = req.query;
    const items = await products.findAll();

    const filtered = items.filter(
      (p) => p.category === req.params.categoryName,
    );

    res.json(limit ? filtered.slice(0, Number(limit)) : filtered);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi lọc theo danh mục",
    });
  }
});

// Lấy sản phẩm đề xuất theo tab.
router.get("/recommended", async (req, res) => {
  try {
    const { tab = "best-seller", limit = 5 } = req.query;
    let items = await products.findAll();

    if (tab === "best-seller") {
      items = items
        .filter((p) => p.isBestSeller)
        .sort((a, b) => (b.purchases || 0) - (a.purchases || 0));
    } else if (tab === "top-rated") {
      items = items
        .filter((p) => (p.rating?.rate || 0) > 0)
        .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    } else {
      // Tab còn lại được xem là tên danh mục.
      items = items.filter((p) => p.category === tab);
    }

    res.json(items.slice(0, Number(limit)));
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi lấy sản phẩm đề xuất",
    });
  }
});

// Lấy sản phẩm đang giảm giá, sắp xếp theo % giảm.
router.get("/clearance", async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    let items = await products.findAll();

    items = items
      .filter((p) => p.originalPrice && p.originalPrice > p.price)
      .map((p) => ({
        ...p,
        discountPercent: Math.round(
          ((p.originalPrice - p.price) / p.originalPrice) * 100,
        ),
      }))
      .sort((a, b) => b.discountPercent - a.discountPercent);

    res.json(items.slice(0, Number(limit)));
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi lấy sản phẩm thanh lý",
    });
  }
});

// Lấy sản phẩm mới, hỗ trợ lọc theo danh mục.
router.get("/new-arrival", async (req, res) => {
  try {
    const { tab = "featured", limit = 8 } = req.query;
    let items = await products.findAll();

    items = items.filter((p) => p.isNew);

    if (tab !== "featured") {
      items = items.filter((p) => p.category === tab);
    }

    items = [...items].sort((a, b) => b.id - a.id);

    res.json(items.slice(0, Number(limit)));
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi lấy sản phẩm mới về",
    });
  }
});

// Lấy danh sách thương hiệu và số lượng sản phẩm.
router.get("/brands", async (req, res) => {
  const items = await products.findAll();
  const counts = {};

  items.forEach((p) => {
    if (p.brand) {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    }
  });

  res.json(
    Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    })),
  );
});

// Lấy sản phẩm theo ID.
router.get("/:id", async (req, res) => {
  try {
    const item = await products.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi tìm sản phẩm",
    });
  }
});

// Admin tạo sản phẩm mới.
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        category,
        image,
        originalPrice,
        isNew,
        isBestSeller,
        inStock,
      } = req.body;

      if (!title || price === undefined || !category) {
        return res.status(400).json({
          message: "Thiếu title/price/category",
        });
      }

      const newProduct = await products.create({
        title,
        price: Number(price),
        description: description || "",
        category,
        image: image || "",
        rating: { rate: 0, count: 0 },
        purchases: 0,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        isNew: Boolean(isNew),
        isBestSeller: Boolean(isBestSeller),
        inStock: inStock === undefined ? true : Boolean(inStock),
      });

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi hệ thống khi tạo sản phẩm",
      });
    }
  },
);

// Admin cập nhật toàn bộ sản phẩm.
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updated = await products.updateById(req.params.id, req.body, {
        replace: true,
      });

      if (!updated) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi hệ thống khi cập nhật sản phẩm",
      });
    }
  },
);

// Admin cập nhật một phần sản phẩm.
router.patch(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updated = await products.updateById(req.params.id, req.body, {
        replace: false,
      });

      if (!updated) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi hệ thống khi sửa sản phẩm",
      });
    }
  },
);

// Admin xóa sản phẩm.
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deleted = await products.deleteById(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.json(deleted);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi hệ thống khi xóa sản phẩm",
      });
    }
  },
);

// Admin thêm nhiều sản phẩm cùng lúc.
router.post(
  "/bulk",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { products: rows } = req.body;

      if (!rows || !Array.isArray(rows)) {
        return res.status(400).json({
          message: "Dữ liệu products gửi lên không hợp lệ hoặc trống",
        });
      }

      const valid = [];
      const skipped = [];

      // Kiểm tra và phân loại dữ liệu hợp lệ.
      rows.forEach((raw, index) => {
        const row = normalizeRow(raw);

        if (!row.title || row.price === undefined || row.price === "") {
          skipped.push({
            rowIndex: index + 2,
            reason: "Thiếu title hoặc price",
            raw,
          });
          return;
        }

        valid.push(row);
      });

      // Lưu lần lượt từng sản phẩm để tránh xung đột đọc/ghi file.
      const created = [];

      for (const row of valid) {
        const item = await products.create({
          title: row.title,
          price: Number(row.price) || 0,
          category: row.category || "",
          image: row.image || "",
          description: row.description || "",
          rating: { rate: 0, count: 0 },
        });

        created.push(item);
      }

      // Trả về kết quả import.
      res.status(201).json({
        count: created.length,
        skippedCount: skipped.length,
        skipped,
        items: created,
      });
    } catch (error) {
      console.error("Error in bulk create:", error);
      res.status(500).json({
        message: "Lỗi hệ thống khi import hàng loạt",
      });
    }
  },
);

module.exports = router;
