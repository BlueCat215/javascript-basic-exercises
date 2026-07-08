const productList = [
  { name: "iPhone 15", price: 22000000, category: "Tech" },
  { name: "Samsung S24", price: 19000000, category: "Tech" },
  { name: "Ốp lưng", price: 150000, category: "Accessories" },
  { name: "Laptop iphone", price: 35000000, category: "Tech" },
];
function searchProducts(products, keyword) {
  const loc = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  return [...loc].sort((a, b) => a.price - b.price);
}
console.log("\nKết quả tìm kiếm từ khóa 'iphone':");
console.log(searchProducts(productList, "iphone"));
