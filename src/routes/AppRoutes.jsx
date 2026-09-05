import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/home/Home";
import ProductListPage from "../pages/products/ProductListPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import CartPage from "../pages/cart/CartPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import ProfilePage from "../pages/account/ProfilePage";
import OrdersPage from "../pages/account/OrdersPage";
import FavoritesPage from "../pages/account/FavoritesPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminAccounts from "../pages/admin/AdminAccounts";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Private */}
      <Route element={<PrivateLayout />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/account/orders" element={<OrdersPage />} />
        <Route path="/account/favorites" element={<FavoritesPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="accounts" element={<AdminAccounts />} />
      </Route>
    </Routes>
  );
}
