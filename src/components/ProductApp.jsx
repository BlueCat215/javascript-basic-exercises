import React, { useMemo, useState } from "react";

const MOCK_PRODUCTS = [
  { id: 1, name: "Laptop Dell XPS", category: "Điện tử", price: 1500 },
  { id: 2, name: "iPhone 14 Pro", category: "Điện tử", price: 1000 },
  { id: 3, name: "Tai nghe Sony", category: "Điện tử", price: 200 },
  { id: 4, name: "Áo thun nam basic", category: "Thời trang", price: 20 },
  { id: 5, name: "Giày chạy bộ Nike", category: "Thời trang", price: 120 },
  { id: 6, name: "Sách Clean Code", category: "Sách", price: 30 },
  { id: 7, name: "Laptop Dell XPS", category: "Điện tử", price: 1500 },
  { id: 8, name: "Bàn phím cơ Keychron", category: "Phụ kiện", price: 100 },
  { id: 9, name: "Chuột Logitech G502", category: "Phụ kiện", price: 50 },
  { id: 10, name: "MacBook Pro M2", category: "Điện tử", price: 2000 },
  { id: 11, name: "Balo chống nước", category: "Thời trang", price: 40 },
];

export const ProductApp = () => {
  const [products] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleChooseItem = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const cartTotal = useMemo(() => {
    console.log("Đang tính tiền");
    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);

  return (
    <div>
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
        }}
      >
        <option value="All">Tất cả</option>
        <option value="Điện tử">Điện tử</option>
        <option value="Thời trang">Thời trang</option>
        <option value="Sách">Sách</option>
        <option value="Phụ kiện">Phụ kiện</option>
      </select>

      <br />
      <br />
      <hr />

      <div>
        {filteredProducts.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>Danh mục: {product.category}</p>
            <p>Giá: ${product.price}</p>
            <button onClick={() => handleChooseItem(product)}>
              Thêm vào giỏ hàng
            </button>
            <hr />
          </div>
        ))}
      </div>

      <br />
      <hr />
      <h2>Giỏ hàng ({cart.length})</h2>

      <ul>
        {cart.map((item, index) => (
          <li key={`${item.id}-${index}`}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>

      <h2>Tổng tiền: ${cartTotal}</h2>
    </div>
  );
};
