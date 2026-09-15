import {
  useFavoritesQuery,
  useRemoveFavorite,
} from "./hooks/useFavoriteQueries";
import { LoadingState, EmptyState } from "../../components/StatusState";
import { ProductCard } from "../../components/ProductCard";

export default function FavoritesPage() {
  const { data: favorites = [], isLoading } = useFavoritesQuery();
  const { mutate: removeFavorite } = useRemoveFavorite();

  if (isLoading) return <LoadingState />;
  if (favorites.length === 0)
    return <EmptyState message="Danh sách yêu thích trống" />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-ink uppercase tracking-wider">
          Sản phẩm yêu thích
        </h1>
        <span className="text-xs sm:text-sm font-bold text-ink uppercase tracking-wider bg-neutral-100 px-3 py-1.5 rounded border border-line/80">
          {favorites.length} <span className="hidden sm:inline">sản phẩm</span>
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {favorites.map((f) => (
          <div
            key={f.id}
            className="relative flex flex-col group bg-white rounded border border-line shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-3 sm:p-4 flex-1">
              <ProductCard product={f.product} />
            </div>

            <button
              onClick={() => removeFavorite(f.productId)}
              className="w-full py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-rust bg-neutral-50 hover:bg-rust hover:text-white border-t border-line transition-colors rounded-b"
            >
              Bỏ yêu thích
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
