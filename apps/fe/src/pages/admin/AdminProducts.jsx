import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../../schemas/productSchema";
import {
  useAdminProductsQuery,
  useAdminCategoriesQuery,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "./hooks/useAdminProductQueries";
import { ProductForm } from "../../components/ProductForm";
import { Pagination } from "../../components/Pagination";
import { ExcelImportButton } from "./components/ExcelImportButton";
import { TableRowSkeleton } from "../../components/Skeleton";

const initialForm = {
  title: "",
  price: "",
  originalPrice: "",
  description: "",
  image: "",
  category: "",
  isNew: false,
  isBestSeller: false,
  inStock: true,
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
  const { data: categories = [] } = useAdminCategoriesQuery();
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
    methods.reset({
      ...initialForm,
      ...product,
      originalPrice: product.originalPrice ?? "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = methods.handleSubmit((formData) => {
    const payload = {
      ...formData,
      originalPrice:
        formData.originalPrice === "" ? null : formData.originalPrice,
    };
    if (editingId)
      updateProduct(
        { id: editingId, data: payload },
        { onSuccess: () => setIsModalOpen(false) },
      );
    else createProduct(payload, { onSuccess: () => setIsModalOpen(false) });
  });

  const handleDelete = (id) => {
    if (window.confirm("Xóa sản phẩm này?")) deleteProduct(id);
  };

  const handleFilterChange = (patch) => {
    setFilters((f) => ({ ...f, ...patch, page: 1 }));
  };

  const hasActiveFilters = filters.q || filters.category;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-display font-bold text-ink">
          Quản lý sản phẩm
        </h1>
        <div className="flex gap-2">
          <ExcelImportButton />
          <button
            onClick={openCreate}
            className="btn-primary text-sm px-4 py-2"
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={filters.q}
          onChange={(e) => handleFilterChange({ q: e.target.value })}
          placeholder="Tìm theo tên sản phẩm..."
          className="border border-line rounded-tag px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
        />
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange({ category: e.target.value })}
          className="border border-line rounded-tag px-3 py-2 text-sm w-full sm:w-48 capitalize focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c} value={c} className="capitalize">
              {c}
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            onClick={() => handleFilterChange({ q: "", category: "" })}
            className="text-xs font-semibold text-ink/50 hover:text-ink px-2"
          >
            Xóa lọc
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-line p-2">
          <thead className="bg-paper">
            <tr className="text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Nhãn</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={6} />
              ))}
            {data?.items?.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="p-3 font-mono">{p.id}</td>
                <td className="p-3 line-clamp-1">{p.title}</td>
                <td className="p-3 capitalize">{p.category}</td>
                <td className="p-3 font-mono">
                  ${p.price}
                  {p.originalPrice > p.price && (
                    <span className="ml-1.5 text-xs text-ink/30 line-through">
                      ${p.originalPrice}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {p.isNew && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                        Mới
                      </span>
                    )}
                    {p.isBestSeller && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gold/20 text-gold">
                        Bán chạy
                      </span>
                    )}
                    {p.originalPrice > p.price && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rust/20 text-rust">
                        Giảm giá
                      </span>
                    )}
                    {p.inStock === false && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-paper text-ink/40">
                        Hết hàng
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-blue-600 hover:underline text-xs font-semibold"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-rust hover:underline text-xs font-semibold"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
