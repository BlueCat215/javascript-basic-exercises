import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useCategories } from "../home/hooks/useHomeQueries";
import {
  useProductListQuery,
  useBrandsQuery,
} from "./hooks/useProductListQuery";
import { ProductCard } from "../../components/ProductCard";
import { Pagination } from "../../components/Pagination";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/StatusState";
import {
  SearchIcon,
  StarIcon,
  MenuIcon,
  ChevronRightIcon,
} from "../../components/icons";

const RATING_OPTIONS = [4, 3, 2, 1];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const brand = searchParams.get("brand") || "";
  const minRating = searchParams.get("minRating") || "";
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

  const filters = useMemo(
    () => ({
      q: q || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      brand: brand || undefined,
      minRating: minRating || undefined,
      sort: sort || undefined,
      page,
      pageSize,
    }),
    [q, category, minPrice, maxPrice, brand, minRating, sort, page, pageSize],
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

  const activeFilterTags = [
    q && { key: "q", label: `Tìm: "${q}"` },
    category && { key: "category", label: category },
    minPrice && { key: "minPrice", label: `Từ $${minPrice}` },
    maxPrice && { key: "maxPrice", label: `Đến $${maxPrice}` },
    minRating && { key: "minRating", label: `${minRating}★ trở lên` },
    ...selectedBrands.map((b) => ({ key: "brand", label: b, value: b })),
  ].filter(Boolean);

  const removeTag = (tag) => {
    if (tag.key === "brand") return toggleBrand(tag.value);
    updateParams({ [tag.key]: null, page: null });
  };

  const resetAll = () => {
    setSearchInput("");
    setSearchParams({});
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ to: "/products", label: "Sản phẩm" }]} />
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-ink">
          Tất cả sản phẩm
        </h1>
        <p className="text-xs text-ink/50 mt-1">
          Khám phá đầy đủ danh mục sản phẩm của MiniShop
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Thanh Bên */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3 flex items-center gap-2">
              <SearchIcon size={14} /> Tìm kiếm
            </p>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tên sản phẩm..."
              className="w-full border border-line rounded-full px-4 py-2 text-sm"
            />
          </div>

          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
              Danh mục
            </p>
            <ul className="text-xs text-ink/70 divide-y divide-line">
              <li>
                <button
                  onClick={() => updateParams({ category: null, page: null })}
                  className={`w-full text-left py-2 flex items-center justify-between hover:text-green ${!category ? "text-green font-semibold" : ""}`}
                >
                  Tất cả <ChevronRightIcon size={12} />
                </button>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => updateParams({ category: c, page: null })}
                    className={`w-full text-left py-2 flex items-center justify-between hover:text-green capitalize ${category === c ? "text-green font-semibold" : ""}`}
                  >
                    {c} <ChevronRightIcon size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {activeFilterTags.length > 0 && (
            <div className="bg-white border border-line rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-ink">
                  Đang lọc
                </p>
                <button
                  onClick={resetAll}
                  className="text-[11px] text-rust hover:underline"
                >
                  Xóa hết
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {activeFilterTags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center bg-paper px-2.5 py-1 rounded text-ink/70 capitalize"
                  >
                    {tag.label}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 text-ink/40 hover:text-ink"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
              Thương hiệu
            </p>
            <div className="space-y-2 text-xs text-ink/70">
              {brands.map((b) => (
                <label
                  key={b.name}
                  className="flex items-center justify-between cursor-pointer hover:text-green"
                >
                  <span className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.name)}
                      onChange={() => toggleBrand(b.name)}
                      className="rounded border-line text-green mr-2"
                    />
                    {b.name}
                  </span>
                  <span className="text-ink/30 text-[11px]">({b.count})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
              Khoảng giá
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-ink/40">$</span>
              <input
                type="number"
                value={priceInputs.min}
                onChange={(e) =>
                  setPriceInputs((s) => ({ ...s, min: e.target.value }))
                }
                className="w-16 text-center border border-line rounded py-1 px-1"
              />
              <span className="text-ink/40">—</span>
              <span className="text-ink/40">$</span>
              <input
                type="number"
                value={priceInputs.max}
                onChange={(e) =>
                  setPriceInputs((s) => ({ ...s, max: e.target.value }))
                }
                className="w-16 text-center border border-line rounded py-1 px-1"
              />
              <button
                onClick={() =>
                  updateParams({
                    minPrice: priceInputs.min || null,
                    maxPrice: priceInputs.max || null,
                    page: null,
                  })
                }
                className="bg-green hover:bg-green-light text-white text-xs px-3 py-1 rounded font-semibold shrink-0"
              >
                Áp dụng
              </button>
            </div>
          </div>

          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
              Đánh giá
            </p>
            <div className="space-y-2 text-xs">
              {RATING_OPTIONS.map((r) => (
                <label
                  key={r}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === String(r)}
                      onChange={() =>
                        updateParams({ minRating: r, page: null })
                      }
                      className="text-green mr-1"
                    />
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        size={12}
                        className={i < r ? "fill-gold text-gold" : "text-line"}
                      />
                    ))}
                  </span>
                  <span className="text-ink/30 text-[11px]">trở lên</span>
                </label>
              ))}
              {minRating && (
                <button
                  onClick={() => updateParams({ minRating: null })}
                  className="text-[11px] text-rust hover:underline"
                >
                  Bỏ chọn
                </button>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-b from-green to-black rounded-lg p-5 text-white">
            <div className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1">
              Ưu đãi
            </div>
            <h5 className="text-lg font-display font-bold mb-2">
              Giảm giá đến 30%
            </h5>
            <p className="text-xs text-white/70 mb-4">Cho đơn hàng đầu tiên</p>
            <a
              href="/products?sort=price_asc"
              className="block text-center bg-gold hover:bg-gold-light text-green text-xs font-bold uppercase py-2.5 rounded transition"
            >
              Xem ngay
            </a>
          </div>
        </aside>

        {/* MAIN */}
        <main className="lg:col-span-9">
          <div className="bg-white border border-line rounded-lg p-3 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-ink/50 font-medium">
              {data && (
                <>
                  <span className="text-ink font-bold">
                    {(data.page - 1) * data.pageSize + 1}–
                    {Math.min(data.page * data.pageSize, data.total)}
                  </span>{" "}
                  / {data.total} kết quả
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-ink/50">Hiển thị</span>
                {[12, 24, 48].map((n) => (
                  <button
                    key={n}
                    onClick={() =>
                      updateParams({
                        pageSize: n === 12 ? null : n,
                        page: null,
                      })
                    }
                    className={`font-bold ${pageSize === n ? "text-green underline" : "text-ink/50 hover:text-ink"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={(e) =>
                  updateParams({ sort: e.target.value || null, page: null })
                }
                className="border border-line rounded px-2 py-1 text-xs"
              >
                <option value="">Mặc định</option>
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {isLoading && <LoadingState />}
          {isError && <ErrorState message="Không tải được sản phẩm" />}
          {data && data.items.length === 0 && <EmptyState />}

          {data && data.items.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {data.items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={(newPage) =>
                  updateParams({ page: newPage === 1 ? null : newPage })
                }
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
