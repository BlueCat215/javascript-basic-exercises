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
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-ink">
          Sản phẩm yêu thích
        </h1>
        <span className="text-sm font-medium text-ink/60 bg-paper px-3 py-1 rounded border border-line">
          {favorites.length} sản phẩm
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((f) => (
          <div key={f.id} className="relative flex flex-col group">
            <ProductCard product={f.product} />

            <button
              onClick={() => removeFavorite(f.productId)}
              className="mt-3 w-full py-2.5 px-4 text-[13px] font-bold text-rust bg-white border border-rust/30 hover:bg-rust hover:text-white rounded shadow-sm transition-all"
            >
              Bỏ yêu thích
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
