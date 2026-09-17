const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Khởi tạo các collection dùng trong router.
const orders = new JsonCollection("orders.json");
const carts = new JsonCollection("carts.json");
const productsCollection = new JsonCollection("products.json");

// Tạo đơn hàng từ giỏ hàng hiện tại.
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { shippingInfo, paymentMethod, productIds } = req.body;
    const currentUserId = Number(req.user.id);

    // Tìm giỏ hàng active của user.
    const allCarts = await carts.findAll();
    const activeCart = allCarts.find(
      (c) => Number(c.userId) === currentUserId && c.status === "active",
    );

    // Kiểm tra giỏ hàng có sản phẩm hay không.
    if (
      !activeCart ||
      !activeCart.products ||
      activeCart.products.length === 0
    ) {
      return res.status(400).json({
        message: "Giỏ hàng đang trống hoặc không tồn tại",
      });
    }

    const hasProductIdsFilter =
      Array.isArray(productIds) && productIds.length > 0;
    const selectedIdSet = hasProductIdsFilter
      ? new Set(productIds.map((id) => Number(id)))
      : null;

    const orderedItems = hasProductIdsFilter
      ? activeCart.products.filter((item) =>
          selectedIdSet.has(Number(item.productId)),
        )
      : activeCart.products;

    const remainingItems = hasProductIdsFilter
      ? activeCart.products.filter(
          (item) => !selectedIdSet.has(Number(item.productId)),
        )
      : [];

    if (orderedItems.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy sản phẩm đã chọn trong giỏ hàng",
      });
    }

    // Tạo Map để tìm thông tin sản phẩm theo ID.
    const allProducts = await productsCollection.findAll();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    // Tính tổng tiền đơn hàng — chỉ tính trên các sản phẩm được chốt đơn.
    const total = orderedItems.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    // Cập nhật giỏ hàng: sản phẩm đã đặt được lấy ra khỏi giỏ active,
    // sản phẩm chưa chọn (nếu có) vẫn được giữ lại để mua sau.
    const updatedCart = await carts.updateById(
      activeCart.id,
      { status: "ordered", products: orderedItems },
      { replace: false },
    );

    if (!updatedCart) {
      return res.status(400).json({
        message: "Xử lý giỏ hàng thất bại, vui lòng thử lại",
      });
    }

    // Tạo đơn hàng mới.
    const newOrder = await orders.create({
      userId: currentUserId,
      products: orderedItems,
      total,
      shippingInfo,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // Tạo giỏ hàng active mới cho user, giữ lại sản phẩm chưa được chọn.
    await carts.create({
      userId: currentUserId,
      status: "active",
      products: remainingItems,
      date: new Date().toISOString(),
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi xử lý đơn hàng",
    });
  }
});

// Lấy lịch sử đơn hàng của user.
// Admin có thể xem đơn hàng của user khác.
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const targetId = Number(req.params.userId);
    const currentUserId = Number(req.user.id);

    // User thường chỉ được xem đơn hàng của chính mình.
    if (req.user.role !== "admin" && currentUserId !== targetId) {
      return res.status(403).json({
        message: "Không có quyền truy cập",
      });
    }

    const allOrders = await orders.findAll();
    const items = allOrders.filter((o) => Number(o.userId) === targetId);

    res.json(items);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi lấy lịch sử đơn hàng",
    });
  }
});

// Admin lấy toàn bộ đơn hàng.
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const allOrders = await orders.findAll();
      res.json(allOrders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({
        message: "Lỗi hệ thống khi lấy danh sách đơn hàng",
      });
    }
  },
);

// Admin cập nhật trạng thái đơn hàng.
router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const order = await orders.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      const DEDUCT_STATUSES = ["shipped", "completed"];
      const prevStatus = order.status;
      const shouldDeduct =
        DEDUCT_STATUSES.includes(status) &&
        !DEDUCT_STATUSES.includes(prevStatus);

      if (shouldDeduct) {
        const allProducts = await productsCollection.findAll();
        const productMap = new Map(allProducts.map((p) => [p.id, p]));

        for (const item of order.products) {
          const product = productMap.get(Number(item.productId));
          if (!product) continue;

          const newStock = Math.max(0, (product.stock ?? 0) - item.quantity);
          await productsCollection.updateById(
            product.id,
            { stock: newStock },
            { replace: false },
          );
        }
      }

      const updated = await orders.updateById(
        req.params.id,
        { status },
        { replace: false },
      );

      res.json(updated);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        message: "Lỗi hệ thống khi cập nhật trạng thái",
      });
    }
  },
);

module.exports = router;
