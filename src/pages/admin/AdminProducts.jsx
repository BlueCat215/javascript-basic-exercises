import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../../schemas/productSchema";
import {
  useAdminProductsQuery,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "./hooks/useAdminProductQueries";
import { ProductForm } from "../../components/products/ProductForm";
import { Pagination } from "../../components/Pagination";
import { ExcelImportButton } from "./components/ExcelImportButton";

const initialForm = {
  title: "",
  price: "",
  description: "",
  image: "",
  category: "",
};

export default function AdminProducts() {
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    page: 1,
    pageSize: 10,
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useAdminProductsQuery(filters);
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialForm,
  });

  const openCreate = () => {
    setEditingId(null);
    methods.reset(initialForm);
    setIsModalOpen(true);
  };
  const openEdit = (product) => {
    setEditingId(product.id);
    methods.reset(product);
    setIsModalOpen(true);
  };

  const onSubmit = methods.handleSubmit((formData) => {
    if (editingId)
      updateProduct(
        { id: editingId, data: formData },
        { onSuccess: () => setIsModalOpen(false) },
      );
    else createProduct(formData, { onSuccess: () => setIsModalOpen(false) });
  });

  const handleDelete = (id) => {
    if (window.confirm("Xóa sản phẩm này?")) deleteProduct(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-display font-bold text-ink">
          Quản lý sản phẩm
        </h1>
        <div className="flex gap-2">
          <ExcelImportButton onImported={() => setFilters((f) => ({ ...f }))} />
          <button
            onClick={openCreate}
            className="btn-primary text-sm px-4 py-2"
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          placeholder="Lọc theo tên..."
          value={filters.q}
          onChange={(e) =>
            setFilters((f) => ({ ...f, q: e.target.value, page: 1 }))
          }
          className="border border-line rounded-tag px-3 py-2 text-sm"
        />
        <input
          placeholder="Lọc theo danh mục..."
          value={filters.category}
          onChange={(e) =>
            setFilters((f) => ({ ...f, category: e.target.value, page: 1 }))
          }
          className="border border-line rounded-tag px-3 py-2 text-sm"
        />
      </div>

      <table className="w-full text-sm border border-line">
        <thead className="bg-paper">
          <tr className="text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Tên</th>
            <th className="p-3">Danh mục</th>
            <th className="p-3">Giá</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5} className="p-4 text-center">
                Đang tải...
              </td>
            </tr>
          )}
          {data?.items?.map((p) => (
            <tr key={p.id} className="border-t border-line">
              <td className="p-3 font-mono">{p.id}</td>
              <td className="p-3 line-clamp-1">{p.title}</td>
              <td className="p-3 capitalize">{p.category}</td>
              <td className="p-3 font-mono">${p.price}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="text-gold hover:underline"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-rust hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-tag p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold mb-4">
              {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>
            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="space-y-4">
                <ProductForm />
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="btn-primary flex-1">
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary flex-1"
                  >
                    Đóng
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </div>
  );
}
