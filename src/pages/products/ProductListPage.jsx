import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useCategories } from "../home/hooks/useHomeQueries";
import { useProductListQuery } from "./hooks/useProductListQuery";
import { ProductCard } from "../../components/ProductCard";
import { Pagination } from "../../components/Pagination";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/StatusState";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    updateParams({ q: debouncedSearch || null, page: null });
  }, [debouncedSearch]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next);
  };

  const filters = useMemo(
    () => ({
      q: q || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sort: sort || undefined,
      page,
      pageSize: 12,
    }),
    [q, category, minPrice, maxPrice, sort, page],
  );

  const { data, isLoading, isError } = useProductListQuery(filters);
  const { data: categories = [] } = useCategories();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="space-y-6">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink/40 block mb-2">
            Tìm kiếm
          </label>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tên sản phẩm..."
            className="w-full border border-line rounded-tag px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink/40 block mb-2">
            Danh mục
          </label>
          <select
            value={category}
            onChange={(e) =>
              updateParams({ category: e.target.value || null, page: null })
            }
            className="w-full border border-line rounded-tag px-3 py-2 text-sm capitalize"
          >
            <option value="">Tất cả</option>
            {categories.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink/40 block mb-2">
            Khoảng giá
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Từ"
              value={minPrice}
              onChange={(e) =>
                updateParams({ minPrice: e.target.value || null, page: null })
              }
              className="w-full border border-line rounded-tag px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Đến"
              value={maxPrice}
              onChange={(e) =>
                updateParams({ maxPrice: e.target.value || null, page: null })
              }
              className="w-full border border-line rounded-tag px-3 py-2 text-sm"
            />
          </div>
        </div>
      </aside>

      {/* Nội dung chính */}
      <div className="md:col-span-3 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-ink/60">
            {data ? `${data.total} sản phẩm` : ""}
          </p>
          <select
            value={sort}
            onChange={(e) =>
              updateParams({ sort: e.target.value || null, page: null })
            }
            className="border border-line rounded-tag px-3 py-2 text-sm"
          >
            <option value="">Mặc định</option>
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
        </div>

        {isLoading && <LoadingState />}
        {isError && <ErrorState message="Không tải được sản phẩm" />}
        {data && data.items.length === 0 && <EmptyState />}

        {data && data.items.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
}
