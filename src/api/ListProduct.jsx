import { useState } from "react";
import { useProductsAxios } from "../hooks/useProductAxios";
const initialForm = {
  title: "",
  price: "",
  description: "",
  image: "",
  category: "",
};

export default function ListProduct() {
  const {
    products,
    productDetail,
    loading,
    error,
    getProducts,
    getDetail,
    createProduct,
    updateProduct,
    patchPrice,
    deleteProduct,
    resetDetail,
  } = useProductsAxios();

  const [form, setForm] = useState(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenCreate = () => {
    resetDetail();
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleSelectDetail = async (id) => {
    const data = await getDetail(id);
    if (data) {
      setForm({
        title: data.title || "",
        price: data.price || "",
        description: data.description || "",
        image: data.image || "",
        category: data.category || "",
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetDetail();
    setForm(initialForm);
  };

  const handleCreate = async () => {
    const success = await createProduct(form);
    if (success) {
      handleCloseModal();
    }
  };

  const handleUpdate = () => {
    if (!productDetail) return alert("Vui lòng chọn sản phẩm để sửa!");
    updateProduct(productDetail.id, form);
    handleCloseModal();
  };

  const handlePatchPrice = () => {
    if (!productDetail) return alert("Vui lòng chọn sản phẩm để sửa giá!");
    patchPrice(productDetail.id, form.price);
    handleCloseModal();
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Danh sách sản phẩm</h1>
        <div className="space-x-3">
          <button
            className="bg-gray-600 text-white px-4 py-2 hover:bg-gray-700 transition"
            onClick={getProducts}
          >
            Tải lại (GET)
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
            onClick={handleOpenCreate}
          >
            + Thêm mới
          </button>
        </div>
      </div>

      {loading && <p className="text-blue-500 font-medium">Đang tải...</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((item) => (
          <div
            key={item.id}
            className="border p-3 flex flex-col justify-between shadow-sm bg-white"
          >
            <div>
              <img
                src={item.image}
                alt={item.title}
                className="h-32 mx-auto object-contain mb-2"
              />
              <h3 className="font-bold line-clamp-2 text-sm">{item.title}</h3>
              <p className="text-green-600 font-semibold mt-1">${item.price}</p>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                className="bg-green-500 text-white px-2 py-1 text-sm flex-1 hover:bg-green-600"
                onClick={() => handleSelectDetail(item.id)}
              >
                Chi tiết / Sửa
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 text-sm flex-1 hover:bg-red-600"
                onClick={() => deleteProduct(item.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-3 p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              {productDetail
                ? `Sửa sản phẩm (ID: ${productDetail.id})`
                : "Thêm sản phẩm mới"}
            </h2>

            <div className="space-y-4">
              <input
                className="border p-2 w-full focus:outline-none focus:border-blue-500"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleInputChange}
              />
              <input
                className="border p-2 w-full focus:outline-none focus:border-blue-500"
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleInputChange}
              />
              <input
                className="border p-2 w-full focus:outline-none focus:border-blue-500"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleInputChange}
              />
              <input
                className="border p-2 w-full focus:outline-none focus:border-blue-500"
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleInputChange}
              />
              <textarea
                className="border p-2 w-full focus:outline-none focus:border-blue-500"
                name="description"
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={handleInputChange}
              />

              <div className="flex gap-2 pt-2">
                {!productDetail ? (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 flex-1 hover:bg-blue-700"
                    onClick={handleCreate}
                  >
                    POST (Thêm)
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 flex-1 hover:bg-yellow-600"
                      onClick={handleUpdate}
                    >
                      PUT (Sửa toàn bộ)
                    </button>
                    <button
                      className="bg-purple-600 text-white px-4 py-2 flex-1 hover:bg-purple-700"
                      onClick={handlePatchPrice}
                    >
                      PATCH (Sửa giá)
                    </button>
                  </>
                )}
                <button
                  className="bg-gray-300 text-black px-4 py-2 hover:bg-gray-400"
                  onClick={handleCloseModal}
                >
                  Đóng
                </button>
              </div>
            </div>

            {productDetail && (
              <div className="border p-4 mt-6 bg-gray-50 text-sm">
                <h3 className="font-bold mb-2">Dữ liệu gốc:</h3>
                <pre className="bg-white p-3 border overflow-x-auto">
                  {JSON.stringify(productDetail, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
