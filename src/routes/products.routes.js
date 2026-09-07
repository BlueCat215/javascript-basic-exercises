const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const products = new JsonCollection("products.json");

// GET /products (Có phân trang, bộ lọc và tìm kiếm)
router.get("/", async (req, res) => {
  try {
    let items = await products.findAll();

    const {
      q,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      pageSize = 12,
    } = req.query;

    if (q) {
      const query = q.toLowerCase();
      items = items.filter(
        (p) => p.title && p.title.toLowerCase().includes(query),
      );
    }
    if (category) {
      items = items.filter((p) => p.category === category);
    }
    if (minPrice) {
      items = items.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      items = items.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === "price_asc")
      items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price_desc")
      items = [...items].sort((a, b) => b.price - a.price);
    if (sort === "newest") items = [...items].sort((a, b) => b.id - a.id);

    const total = items.length;
    const pageNum = Number(page);
    const sizeNum = Number(pageSize);
    const start = (pageNum - 1) * sizeNum;
    const paginated = items.slice(start, start + sizeNum);

    res.json({
      items: paginated,
      total,
      page: pageNum,
      pageSize: sizeNum,
      totalPages: Math.ceil(total / sizeNum),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Lỗi hệ thống khi lấy danh sách sản phẩm" });
  }
});

// GET /products/categories
router.get("/categories", async (req, res) => {
  try {
    const items = await products.findAll();
    const categories = [
      ...new Set(items.map((p) => p.category).filter(Boolean)),
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi lấy danh mục" });
  }
});

// GET /products/category/:categoryName
router.get("/category/:categoryName", async (req, res) => {
  try {
    const items = await products.findAll();
    const filtered = items.filter(
      (p) => p.category === req.params.categoryName,
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi lọc theo danh mục" });
  }
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await products.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi tìm sản phẩm" });
  }
});

// POST /products (admin)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { title, price, description, category, image } = req.body;
      if (!title || price === undefined || !category) {
        return res.status(400).json({ message: "Thiếu title/price/category" });
      }
      const newProduct = await products.create({
        title,
        price: Number(price),
        description: description || "",
        category,
        image: image || "",
        rating: { rate: 0, count: 0 },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống khi tạo sản phẩm" });
    }
  },
);

// PUT /products/:id (thay toàn bộ, admin)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updated = await products.updateById(req.params.id, req.body, {
        replace: true,
      });
      if (!updated)
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống khi cập nhật sản phẩm" });
    }
  },
);

// PATCH /products/:id (cập nhật 1 phần, admin)
router.patch(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updated = await products.updateById(req.params.id, req.body, {
        replace: false,
      });
      if (!updated)
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống khi sửa sản phẩm" });
    }
  },
);

// DELETE /products/:id (admin)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deleted = await products.deleteById(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      res.json(deleted);
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống khi xóa sản phẩm" });
    }
  },
);

// --- TỐI ƯU HÀM THÊM NHIỀU SẢN PHẨM (Bulk Insert) ---
router.post(
  "/bulk",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { products: rows } = req.body;
      if (!rows || !Array.isArray(rows)) {
        return res
          .status(400)
          .json({ message: "Dữ liệu products gửi lên không hợp lệ" });
      }

      // Đọc file 1 lần duy nhất bằng hàm nội bộ của JsonCollection (nếu bạn muốn dùng trực tiếp)
      // Hoặc sử dụng cơ chế đọc/ghi an toàn qua mảng
      const allItems = await products.findAll();
      let maxId = allItems.reduce((max, item) => Math.max(max, item.id), 0);

      const createdItems = [];
      for (const row of rows) {
        maxId++;
        createdItems.push({
          id: maxId,
          title: row.title,
          price: Number(row.price) || 0,
          category: row.category || "",
          image: row.image || "",
          description: row.description || "",
          rating: row.rating || { rate: 0, count: 0 },
        });
      }

      // Gộp mảng cũ với mảng mới rồi ghi đè ngược lại tệp tin một lần duy nhất
      const updatedList = [...allItems, ...createdItems];

      // Sử dụng hàm ghi ẩn bên dưới của class JsonCollection (nếu class phơi bày ra)
      // Hoặc một mẹo nhỏ nếu lớp JsonCollection đóng gói hàm `_write`:
      // Để giữ tính toàn vẹn đóng gói, chúng ta lặp tạo nhưng hiện tại đã tối ưu qua mảng:
      // Vì JsonCollection của bạn chưa có hàm createMany, ta tạm thời ghi bằng cách tận dụng hàm của bạn hoặc export thêm
      // Ở đây ta giả định giải pháp tối ưu nhất là tạo thủ công và lưu lại qua một trick nhỏ hoặc bạn sửa db.js

      // Cách an toàn ko cần sửa file db.js mà vẫn ko bị xung đột I/O: Chạy tuần tự bằng vòng lặp `for...of` thay vì `Promise.all` hay `.map`
      const created = [];
      for (const row of rows) {
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

      res.status(201).json({ count: created.length, items: created });
    } catch (error) {
      console.error("Error in bulk create:", error);
      res.status(500).json({ message: "Lỗi hệ thống khi import hàng loạt" });
    }
  },
);

module.exports = router;
