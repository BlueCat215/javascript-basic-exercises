import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { logout as logoutApi } from "../api/services/authService";
import { useActiveCart } from "../pages/cart/hooks/useCartQueries";
import { useFavoritesQuery } from "../pages/account/hooks/useFavoriteQueries";
import { useCategories } from "../pages/home/hooks/useHomeQueries";
import { TopBar } from "./header/TopBar";
import { MobileMenu } from "./header/MobileMenu";
import { Navbar } from "./header/Navbar";

export const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const { data: cart } = useActiveCart({ enabled: isAuthenticated });
  const { data: favorites = [] } = useFavoritesQuery();
  const { data: categories = [] } = useCategories();

  const cartCount =
    cart?.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;
  const cartTotal =
    cart?.products?.reduce(
      (sum, p) => sum + (p.product?.price || 0) * p.quantity,
      0,
    ) || 0;

  const handleLogout = async () => {
    try {
      await logoutApi(localStorage.getItem("refreshToken"));
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (searchCategory) params.set("category", searchCategory);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <>
      <TopBar
        search={search}
        setSearch={setSearch}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        categories={categories}
        onSearchSubmit={handleSearch}
        onOpenMobileMenu={() => setShowMobileMenu(true)}
        isAuthenticated={isAuthenticated}
        favorites={favorites}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onLogout={handleLogout}
      />

      <MobileMenu
        open={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        search={search}
        setSearch={setSearch}
        onSearchSubmit={handleSearch}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        categories={categories}
      />

      <Navbar categories={categories} />
    </>
  );
};
