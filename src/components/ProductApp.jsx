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
    <div className="max-w-5xl mx-auto p-6 bg-white mt-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
        Quản lý sản phẩm & Giỏ hàng
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black transition"
        />

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
          className="md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition"
        >
          <option value="All">Tất cả</option>
          <option value="Điện tử">Điện tử</option>
          <option value="Thời trang">Thời trang</option>
          <option value="Sách">Sách</option>
          <option value="Phụ kiện">Phụ kiện</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">
            Danh sách sản phẩm
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 border-2 flex flex-col justify-between hover:bg-green-200 transition"
              >
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md">
                      {product.category}
                    </span>
                  </p>
                  <p className="text-sm font-medium text-gray-800 mb-4">
                    ${product.price}
                  </p>
                </div>
                <button
                  onClick={() => handleChooseItem(product)}
                  className="w-full px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-2 py-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-2 h-fit">
          <h3 className="text-md font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">
            Giỏ hàng ({cart.length})
          </h3>

          <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {cart.map((item, index) => (
              <li
                key={`${item.id}-${index}`}
                className="flex justify-between items-center text-sm bg-white p-2 border border-gray-200 rounded"
              >
                <span className="text-gray-800 truncate pr-2">{item.name}</span>
                <span className="text-gray-600 font-medium whitespace-nowrap">
                  ${item.price}
                </span>
              </li>
            ))}

            {cart.length === 0 && (
              <li className="text-sm text-gray-500 text-center py-4">
                Giỏ hàng trống.
              </li>
            )}
          </ul>

          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="font-medium text-gray-700 text-sm">
              Tổng tiền:
            </span>
            <span className="font-semibold text-gray-900 text-base">
              ${cartTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
