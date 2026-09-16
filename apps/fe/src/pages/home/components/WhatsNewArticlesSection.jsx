import { useArticles } from "../hooks/useHomeQueries";
import { LoadingState } from "../../../components/StatusState";

const formatAgo = (minutes) => {
  if (minutes < 60) return `${minutes} Minutes ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)} Hours ago`;
  return `${Math.round(minutes / (60 * 24))} Days ago`;
};

export const WhatsNewArticlesSection = () => {
  const { data: articles = [], isLoading } = useArticles();

  if (!isLoading && articles.length === 0) return null;

  const [featured, ...rest] = articles;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold text-ink">
          <span className="text-green">What's New</span> Today
        </h2>
        <span className="text-xs text-ink/40 cursor-default">
          Xem thêm bài viết
        </span>
      </div>

      {isLoading && <LoadingState />}
      {!isLoading && featured && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group relative rounded-lg overflow-hidden h-64 md:h-full min-h-65 cursor-default">
            <img
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 text-white">
              <p className="font-display text-lg font-bold leading-snug mb-1">
                {featured.title}
              </p>
              <p className="text-xs text-white/70">
                {formatAgo(featured.minutesAgo)} in {featured.category}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rest.map((article) => (
              <div key={article.id} className="flex gap-3 group cursor-default">
                <div className="w-20 h-16 shrink-0 rounded-md overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink line-clamp-2 leading-tight group-hover:text-green">
                    {article.title}
                  </p>
                  <p className="text-[11px] text-ink/40 mt-1">
                    {formatAgo(article.minutesAgo)} in {article.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
