import { Link } from "react-router-dom";
import {
  useFavoritesQuery,
  useRemoveFavorite,
} from "./hooks/useFavoriteQueries";
import { LoadingState, EmptyState } from "../../components/StatusState";

export default function FavoritesPage() {
  const { data: favorites = [], isLoading } = useFavoritesQuery();
  const { mutate: removeFavorite } = useRemoveFavorite();

  if (isLoading) return <LoadingState />;
  if (favorites.length === 0)
    return <EmptyState message="Danh sách yêu thích trống" />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-display font-bold text-ink mb-6">
        Sản phẩm yêu thích
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {favorites.map((f) => (
          <div key={f.id} className="border border-line rounded-tag p-3">
            <Link to={`/products/${f.productId}`}>
              <img
                src={f.product?.image}
                alt={f.product?.title}
                className="h-24 object-contain mx-auto"
              />
              <p className="text-sm font-medium mt-2 line-clamp-2">
                {f.product?.title}
              </p>
            </Link>
            <button
              onClick={() => removeFavorite(f.productId)}
              className="text-xs text-rust hover:underline mt-2"
            >
              Bỏ yêu thích
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
