import React, { useState, useMemo } from "react";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Laptop Dell XPS",
    category: "Điện tử",
    price: 1500,
  },
  {
    id: 2,
    name: "Bàn phím cơ Keychron",
    category: "Phụ kiện",
    price: 100,
  },
  {
    id: 3,
    name: "Chuột Logitech G502",
    category: "Phụ kiện",
    price: 50,
  },
  {
    id: 4,
    name: "MacBook Pro M2",
    category: "Điện tử",
    price: 2000,
  },
  {
    id: 5,
    name: "Balo chống nước",
    category: "Thời trang",
    price: 40,
  },
];

export default function ProductApp() {
  const [products] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const filteredProducts = products.filter((product) => {
    const matchName = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchName && matchCategory;
  });

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const cartTotal = useMemo(() => {
    console.log("Đang tính toán lại tổng tiền...");

    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Cửa hàng sản phẩm
        </h2>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col gap-4 rounded-lg bg-white p-5 shadow-md sm:flex-row">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          >
            <option value="All">Tất cả danh mục</option>
            <option value="Điện tử">Điện tử</option>
            <option value="Phụ kiện">Phụ kiện</option>
            <option value="Thời trang">Thời trang</option>
          </select>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product List */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-2xl font-bold text-gray-800">Danh sách</h3>

            {filteredProducts.length === 0 && (
              <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
            )}

            <ul className="space-y-4">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <strong className="block text-lg text-gray-800">
                      {product.name}
                    </strong>

                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>

                    <p className="font-semibold text-green-600">
                      ${product.price}
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-95"
                  >
                    Thêm vào giỏ
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Cart */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-2xl font-bold text-gray-800">
              Giỏ hàng của bạn
              <span className="ml-2 text-blue-600">({cart.length} món)</span>
            </h3>

            {cart.length === 0 ? (
              <p className="text-gray-500">Giỏ hàng đang trống.</p>
            ) : (
              <ul className="space-y-3">
                {cart.map((item, index) => (
                  <li
                    key={index}
                    className="rounded-lg bg-gray-100 p-3 text-gray-700"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 border-t pt-4">
              <h4 className="text-xl font-bold">
                Tổng tiền: <span className="text-red-600">${cartTotal}</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
