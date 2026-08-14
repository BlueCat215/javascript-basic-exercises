import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  getProductsDetail,
  addProduct,
  patchItem,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from "../api/productService";

export function useProductsAxios() {
  const [products, setProducts] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allProduct = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProducts("?limit=8");
      setProducts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    allProduct();
  }, [allProduct]);

  const getDetail = async (id) => {
    setLoading(true);
    try {
      const data = await getProductsDetail(id);
      setProductDetail(data);
      return data;
    } catch (e) {
      alert("Lỗi: " + e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData) => {
    try {
      const payload = { ...formData, price: Number(formData.price) || 0 };
      const data = await addProduct(payload);
      const newProduct = { ...data, id: Date.now() };
      setProducts((prev) => [newProduct, ...prev]);
      alert("POST thành công");
      return true;
    } catch (e) {
      alert("Lỗi: " + e.message);
      return false;
    }
  };

  const updateProduct = async (id, formData) => {
    if (!id) return false;
    try {
      const payload = { ...formData, price: Number(formData.price) || 0 };
      const data = await updateProductApi(id, payload);

      const updatedItem = { ...data, id };
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedItem : p)));
      setProductDetail(updatedItem);
      alert("PUT thành công");
      return true;
    } catch (e) {
      alert("Lỗi: " + e.message);
      return false;
    }
  };

  const patchPrice = async (id, price) => {
    if (!id) return false;
    try {
      const newPrice = Number(price) || 0;
      await patchItem(id, { price: newPrice });

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p)),
      );
      setProductDetail((prev) => (prev ? { ...prev, price: newPrice } : null));
      alert("PATCH thành công");
      return true;
    } catch (e) {
      alert("Lỗi: " + e.message);
      return false;
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await deleteProductApi(id);

      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (productDetail?.id === id) setProductDetail(null);
      alert("DELETE thành công");
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  const resetDetail = () => setProductDetail(null);

  return {
    products,
    productDetail,
    loading,
    error,
    getProducts: allProduct, // hàm có cập nhật state
    getDetail,
    createProduct,
    updateProduct,
    patchPrice,
    deleteProduct,
    resetDetail,
  };
}
