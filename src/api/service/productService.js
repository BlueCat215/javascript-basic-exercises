import api from "../config/config";

const getProducts = (query = "") => {
  return api.get(`/products${query}`);
};

const getProductsDetail = (id) => {
  return api.get(`/products/${id}`);
};

const patchItem = (id, item) => {
  return api.patch(`/products/${id}`, item);
};

const addProduct = (obj) => {
  return api.post("/products", obj);
};

const updateProduct = (id, obj) => {
  return api.put(`/products/${id}`, obj);
};

const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

export {
  getProducts,
  getProductsDetail,
  addProduct,
  updateProduct,
  patchItem,
  deleteProduct,
};
