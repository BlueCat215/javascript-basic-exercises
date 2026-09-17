const fs = require("fs");
const p = "apps/be/data/products.json";
const data = JSON.parse(fs.readFileSync(p, "utf-8"));
const migrated = data.map((item) => {
  if (!item.images) {
    item.images = item.image ? [item.image] : [];
  }
  delete item.image;
  return item;
});
fs.writeFileSync(p, JSON.stringify(migrated, null, 2));
console.log("Done:", migrated.length, "san pham da migrate");
