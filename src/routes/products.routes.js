const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const products = new JsonCollection("products.json");

// GET
router.get("/", (req, res) => {
  let items = products.findAll();

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
    items = items.filter((p) => p.title.toLowerCase().includes(query));
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
});

// GET /products/categories
router.get("/categories", (req, res) => {
  const items = products.findAll();
  const categories = [...new Set(items.map((p) => p.category))];
  res.json(categories);
});

// GET /products/category/:categoryName
router.get("/category/:categoryName", (req, res) => {
  const items = products.findAll();
  const filtered = items.filter((p) => p.category === req.params.categoryName);
  res.json(filtered);
});

// GET /products/:id
router.get("/:id", (req, res) => {
  const item = products.findById(req.params.id);
  if (!item)
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  res.json(item);
});

// POST /products (chỉ admin)
router.post("/", authenticateToken, authorizeRoles("admin"), (req, res) => {
  const { title, price, description, category, image } = req.body;
  if (!title || price === undefined || !category) {
    return res.status(400).json({ message: "Thiếu title/price/category" });
  }
  const newProduct = products.create({
    title,
    price,
    description: description || "",
    category,
    image: image || "",
    rating: { rate: 0, count: 0 },
  });
  res.status(201).json(newProduct);
});

// PUT /products/:id (thay toàn bộ, chỉ admin)
router.put("/:id", authenticateToken, authorizeRoles("admin"), (req, res) => {
  const updated = products.updateById(req.params.id, req.body, {
    replace: true,
  });
  if (!updated)
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  res.json(updated);
});

// PATCH /products/:id (cập nhật 1 phần, chỉ admin)
router.patch("/:id", authenticateToken, authorizeRoles("admin"), (req, res) => {
  const updated = products.updateById(req.params.id, req.body, {
    replace: false,
  });
  if (!updated)
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  res.json(updated);
});

// DELETE /products/:id (chỉ admin)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {
    const deleted = products.deleteById(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(deleted);
  },
);

module.exports = router;
