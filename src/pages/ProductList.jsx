import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { logout as logoutApi } from "../api/services/authService";
import {
  useProducts,
  useProductDetail,
  useAddMutation,
  useUpdateMutation,
  usePatchPriceMutation,
  useDeleteMutation,
} from "../hooks/useProductQueries";

import { ProductToolbar } from "../components/products/ProductToolbar";
import { ProductGrid } from "../components/products/ProductGrid";
import { ProductDrawer } from "../components/products/ProductDrawer";

import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/products/StatusState";

import { CartDrawer } from "../components/cart/CartDrawer";

const initialForm = {
  title: "",
  price: "",
  description: "",
  image: "",
  category: "",
};

export default function ListProduct() {
  const [form, setForm] = useState(initialForm);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: products = [], isLoading, isError, error } = useProducts();
  const { data: productDetail } = useProductDetail(selectedId);

  const { mutate: addProductMutate, isPending: isAdding } = useAddMutation();
  const { mutate: updateProductMutate, isPending: isUpdating } =
    useUpdateMutation();
  const { mutate: patchPriceMutate, isPending: isPatching } =
    usePatchPriceMutation();
  const { mutate: deleteProductMutate } = useDeleteMutation();

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q),
    );
  }, [products, query]);

  const handleLogout = async () => {
    try {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      await logoutApi(refreshTokenValue);
    } catch (e) {
      console.log(e);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  const handleInputChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleOpenCreate = useCallback(() => {
    setSelectedId(null);
    setForm(initialForm);
    setIsDrawerOpen(true);
  }, []);

  const handleEditWithData = useCallback((item) => {
    setSelectedId(item.id);
    setForm({
      title: item.title || "",
      price: item.price || "",
      description: item.description || "",
      image: item.image || "",
      category: item.category || "",
    });
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedId(null);
    setForm(initialForm);
  }, []);

  const handleCreate = useCallback(() => {
    const payload = { ...form, price: Number(form.price) || 0 };
    addProductMutate(payload, {
      onSuccess: () => {
        toast.success("POST thành công");
        handleCloseDrawer();
      },
    });
  }, [form, addProductMutate, handleCloseDrawer]);

  const handleUpdate = useCallback(() => {
    if (!selectedId) return toast.error("Vui lòng chọn sản phẩm để sửa!");
    const payload = { ...form, price: Number(form.price) || 0 };
    updateProductMutate(
      { id: selectedId, obj: payload },
      {
        onSuccess: () => {
          toast.success("PUT thành công");
          handleCloseDrawer();
        },
      },
    );
  }, [selectedId, form, updateProductMutate, handleCloseDrawer]);

  const handlePatchPrice = useCallback(() => {
    if (!selectedId) return toast.error("Vui lòng chọn sản phẩm để sửa giá!");
    patchPriceMutate(
      { id: selectedId, item: { price: Number(form.price) || 0 } },
      {
        onSuccess: () => {
          toast.success("PATCH thành công");
          handleCloseDrawer();
        },
      },
    );
  }, [selectedId, form.price, patchPriceMutate, handleCloseDrawer]);

  const handleDelete = useCallback(
    (id) => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
      deleteProductMutate(id, {
        onSuccess: () => toast.success("DELETE thành công"),
      });
    },
    [deleteProductMutate],
  );

  const handleOpenCart = useCallback(() => setIsCartOpen(true), []);
  const handleCloseCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <div className="min-h-screen bg-paper">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <ProductToolbar
          query={query}
          onQueryChange={setQuery}
          onCreate={handleOpenCreate}
          total={products.length}
          onOpenCart={handleOpenCart}
          isAdmin={user?.role === "admin"}
        />
        <div className="flex justify-end items-center gap-3 mb-2">
          <span className="text-sm text-ink/60">
            Xin chào, {user?.name?.firstname} {user?.name?.lastname}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-rust hover:underline"
          >
            Đăng xuất
          </button>
        </div>

        {isLoading && <LoadingState />}
        {isError && <ErrorState message={error?.message || "Đã xảy ra lỗi"} />}
        {!isLoading && !isError && filteredProducts.length === 0 && (
          <EmptyState onCreate={handleOpenCreate} />
        )}
        {!isLoading && !isError && filteredProducts.length > 0 && (
          <ProductGrid
            products={filteredProducts}
            onEdit={handleEditWithData}
            onDelete={handleDelete}
            isAdmin={user?.role === "admin"}
          />
        )}
      </div>
      <ProductDrawer
        isOpen={isDrawerOpen}
        selectedId={selectedId}
        form={form}
        onChange={handleInputChange}
        onClose={handleCloseDrawer}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onPatchPrice={handlePatchPrice}
        isAdding={isAdding}
        isUpdating={isUpdating}
        isPatching={isPatching}
        productDetail={productDetail}
      />
      <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} />
    </div>
  );
}
