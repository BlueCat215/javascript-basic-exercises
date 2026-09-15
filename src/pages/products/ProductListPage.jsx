import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useCategories } from "../home/hooks/useHomeQueries";
import {
  useProductListQuery,
  useBrandsQuery,
} from "./hooks/useProductListQuery";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ProductFilterSidebar } from "./components/filters/ProductFilterSidebar";
import { MobileFilterDrawer } from "./components/MobileFilterDrawer";
import { ProductListToolbar } from "./components/ProductListToolbar";
import { ProductGrid } from "./components/ProductGrid";

const RATING_OPTIONS = [4, 3, 2, 1];

const QUICK_FILTERS = [
  { key: "isNew", label: "Sản phẩm mới" },
  { key: "isBestSeller", label: "Bán chạy" },
  { key: "onSale", label: "Đang giảm giá" },
];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const brand = searchParams.get("brand") || "";
  const minRating = searchParams.get("minRating") || "";
  const isNew = searchParams.get("isNew") === "true";
  const isBestSeller = searchParams.get("isBestSeller") === "true";
  const onSale = searchParams.get("onSale") === "true";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 12;

  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 500);
  const [priceInputs, setPriceInputs] = useState({
    min: minPrice,
    max: maxPrice,
  });

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next);
  };

  useEffect(() => {
    updateParams({ q: debouncedSearch || null, page: null });
  }, [debouncedSearch]);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isFilterOpen]);

  const filters = useMemo(
    () => ({
      q: q || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      brand: brand || undefined,
      minRating: minRating || undefined,
      isNew: isNew || undefined,
      isBestSeller: isBestSeller || undefined,
      onSale: onSale || undefined,
      sort: sort || undefined,
      page,
      pageSize,
    }),
    [
      q,
      category,
      minPrice,
      maxPrice,
      brand,
      minRating,
      isNew,
      isBestSeller,
      onSale,
      sort,
      page,
      pageSize,
    ],
  );

  const { data, isLoading, isError } = useProductListQuery(filters);
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrandsQuery();

  const selectedBrands = brand ? brand.split(",") : [];
  const toggleBrand = (name) => {
    const next = selectedBrands.includes(name)
      ? selectedBrands.filter((b) => b !== name)
      : [...selectedBrands, name];
    updateParams({ brand: next.length ? next.join(",") : null, page: null });
  };

  const quickFilterState = { isNew, isBestSeller, onSale };
  const toggleQuickFilter = (key) => {
    updateParams({ [key]: quickFilterState[key] ? null : "true", page: null });
  };

  const activeFilterTags = [
    q && { key: "q", label: `Tìm: "${q}"` },
    category && { key: "category", label: category },
    minPrice && { key: "minPrice", label: `Từ $${minPrice}` },
    maxPrice && { key: "maxPrice", label: `Đến $${maxPrice}` },
    minRating && { key: "minRating", label: `${minRating}★ trở lên` },
    ...QUICK_FILTERS.filter((f) => quickFilterState[f.key]).map((f) => ({
      key: f.key,
      label: f.label,
    })),
    ...selectedBrands.map((b) => ({ key: "brand", label: b, value: b })),
  ].filter(Boolean);

  const pageTitle = isNew
    ? "Sản phẩm mới"
    : onSale
      ? "Sản phẩm đang giảm giá"
      : isBestSeller
        ? "Sản phẩm bán chạy"
        : "Tất cả sản phẩm";

  const removeTag = (tag) => {
    if (tag.key === "brand") return toggleBrand(tag.value);
    updateParams({ [tag.key]: null, page: null });
  };

  const resetAll = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const filterSidebarProps = {
    searchInput,
    onSearchChange: setSearchInput,
    quickFilters: QUICK_FILTERS,
    quickFilterState,
    onToggleQuickFilter: toggleQuickFilter,
    categories,
    selectedCategory: category,
    onSelectCategory: (c) => updateParams({ category: c, page: null }),
    activeFilterTags,
    onRemoveTag: removeTag,
    onClearAll: resetAll,
    brands,
    selectedBrands,
    onToggleBrand: toggleBrand,
    priceInputs,
    onPriceMinChange: (v) => setPriceInputs((s) => ({ ...s, min: v })),
    onPriceMaxChange: (v) => setPriceInputs((s) => ({ ...s, max: v })),
    onApplyPrice: () =>
      updateParams({
        minPrice: priceInputs.min || null,
        maxPrice: priceInputs.max || null,
        page: null,
      }),
    ratingOptions: RATING_OPTIONS,
    selectedRating: minRating,
    onSelectRating: (r) => updateParams({ minRating: r, page: null }),
    onClearRating: () => updateParams({ minRating: null }),
    onPromoClick: () =>
      updateParams({ onSale: "true", sort: "discount_desc", page: null }),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ to: "/products", label: "Sản phẩm" }]} />
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-ink">
          {pageTitle}
        </h1>
        <p className="text-xs text-ink/50 mt-1">
          Khám phá đầy đủ danh mục sản phẩm của MiniShop
        </p>
      </div>

      <button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden mb-4 w-full flex items-center justify-center gap-2 border border-line rounded-lg bg-white py-2.5 text-sm font-semibold text-ink"
      >
        Bộ lọc
        {activeFilterTags.length > 0 && (
          <span className="bg-green text-white text-[11px] font-bold w-5 h-5 rounded-full grid place-items-center">
            {activeFilterTags.length}
          </span>
        )}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          <ProductFilterSidebar {...filterSidebarProps} />
        </aside>

        <MobileFilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          resultCount={data?.total}
        >
          <ProductFilterSidebar {...filterSidebarProps} />
        </MobileFilterDrawer>

        <main className="lg:col-span-9 min-w-0">
          <ProductListToolbar
            data={data}
            pageSize={pageSize}
            sort={sort}
            onPageSizeChange={(n) =>
              updateParams({ pageSize: n === 12 ? null : n, page: null })
            }
            onSortChange={(v) => updateParams({ sort: v || null, page: null })}
          />
          <ProductGrid
            isLoading={isLoading}
            isError={isError}
            data={data}
            pageSize={pageSize}
            onPageChange={(newPage) =>
              updateParams({ page: newPage === 1 ? null : newPage })
            }
          />
        </main>
      </div>
    </div>
  );
}
