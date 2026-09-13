const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/products.json");
const brands = ["Nova", "Urban Craft", "Zenith", "Meadow & Co.", "Kaira"];

const products = JSON.parse(fs.readFileSync(filePath, "utf-8"));
const updated = products.map((p, i) => ({
  ...p,
  brand: brands[i % brands.length],
}));

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
console.log(`Đã gán brand cho ${updated.length} sản phẩm`);
