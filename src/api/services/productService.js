import httpClient from "../clients/httpClient";

const getProducts = (query = "") => {
  return httpClient.get(`/products${query}`);
};

const getProductsDetail = (id) => {
  return httpClient.get(`/products/${id}`);
};

const patchItem = (id, item) => {
  return httpClient.patch(`/products/${id}`, item);
};

const addProduct = (obj) => {
  return httpClient.post("/products", obj);
};

const updateProduct = (id, obj) => {
  return httpClient.put(`/products/${id}`, obj);
};

const deleteProduct = (id) => {
  return httpClient.delete(`/products/${id}`);
};

export {
  getProducts,
  getProductsDetail,
  addProduct,
  updateProduct,
  patchItem,
  deleteProduct,
};
