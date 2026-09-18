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
import adminProductService from "./services/adminProductService";

const initialForm = {
  title: "",
  price: "",
  originalPrice: "",
  description: "",
  images: [],
  stock: 0,
  category: "",
  isNew: false,
  isBestSeller: false,
};

export default function AdminProducts() {
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    page: 1,
    pageSize: 10,
  });
  const [editingId, setEditingId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
    setIsPanelOpen(true);
  };
  const openEdit = (product) => {
    setEditingId(product.id);
    methods.reset({
      ...initialForm,
      ...product,
      images: product.images ?? [],
      stock: product.stock ?? 0,
      originalPrice: product.originalPrice ?? "",
    });
    setIsPanelOpen(true);
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
        { onSuccess: () => setIsPanelOpen(false) },
      );
    else createProduct(payload, { onSuccess: () => setIsPanelOpen(false) });
  });

  const handleDelete = (id) => {
    if (window.confirm("Xóa sản phẩm này?")) deleteProduct(id);
  };

  const handleFilterChange = (patch) => {
    setFilters((f) => ({ ...f, ...patch, page: 1 }));
  };

  const hasActiveFilters = filters.q || filters.category;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-ink/50">Quản trị</p>
          <h1 className="text-xl font-display font-semibold text-ink mt-1">
            Sản phẩm
          </h1>
        </div>
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

      <div className="flex flex-wrap items-end gap-6">
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={filters.q}
            onChange={(e) => handleFilterChange({ q: e.target.value })}
            placeholder="Tìm theo tên sản phẩm..."
            className="w-full border-b border-line bg-transparent py-2 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            className="w-full border-b border-line bg-transparent py-2 text-sm capitalize focus:outline-none focus:border-gold transition-colors"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => handleFilterChange({ q: "", category: "" })}
            className="text-xs font-medium text-ink/50 hover:text-ink pb-2.5"
          >
            Xóa lọc
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-sm">
          <thead className="bg-paper">
            <tr className="text-left">
              <th className="p-3 font-medium text-ink/60">ID</th>
              <th className="p-3 font-medium text-ink/60">Tên</th>
              <th className="p-3 font-medium text-ink/60">Danh mục</th>
              <th className="p-3 font-medium text-ink/60">Giá</th>
              <th className="p-3 font-medium text-ink/60">Nhãn</th>
              <th className="p-3 font-medium text-ink/60">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={6} />
              ))}
            {data?.items?.map((p) => (
              <tr key={p.id}>
                <td className="p-3 font-mono text-ink/60">{p.id}</td>
                <td className="p-3 line-clamp-1">{p.title}</td>
                <td className="p-3 capitalize text-ink/70">{p.category}</td>
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
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm border border-green-light/50 text-green-light">
                        Mới
                      </span>
                    )}
                    {p.isBestSeller && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm border border-gold/40 text-gold">
                        Bán chạy
                      </span>
                    )}
                    {p.originalPrice > p.price && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm border border-rust/40 text-rust">
                        Giảm giá
                      </span>
                    )}
                    {p.inStock === false && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm border border-line text-ink/40">
                        Hết hàng
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-gold hover:underline text-xs font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-rust hover:underline text-xs font-medium"
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

      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-ink/30"
            onClick={() => setIsPanelOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-xl h-full bg-surface border-l border-line flex flex-col">
            <div className="flex items-center justify-between px-6 h-14 border-b border-line shrink-0">
              <h2 className="font-display font-semibold text-ink">
                {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="text-ink/40 hover:text-ink text-xl leading-none"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>
            <FormProvider {...methods}>
              <form
                onSubmit={onSubmit}
                className="flex flex-col flex-1 min-h-0"
              >
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <ProductForm
                    onUpload={(files) =>
                      adminProductService.uploadImages(files)
                    }
                  />
                </div>
                <div className="flex gap-2 px-6 py-4 border-t border-line shrink-0">
                  <button type="submit" className="btn-primary flex-1">
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPanelOpen(false)}
                    className="text-sm text-ink/60 hover:text-ink px-4"
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
