import { useCategories, useProductsByCategories } from "./hooks/useHomeQueries";
import { HeroBanner } from "./components/HeroBanner";
import { CategorySection } from "./components/CategorySection";
import { PartnerSection } from "./components/PartnerSection";
import { LoadingState, ErrorState } from "../../components/StatusState";

export default function Home() {
  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();
  const categoryQueries = useProductsByCategories(categories);

  const isLoading =
    loadingCategories || categoryQueries.some((q) => q.isLoading);
  const isError = categoryQueries.some((q) => q.isError);

  return (
    <div>
      <HeroBanner />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {isLoading && <LoadingState />}
        {isError && <ErrorState message="Không tải được sản phẩm" />}

        {!isLoading &&
          !isError &&
          categories.map((category, index) => (
            <CategorySection
              key={category}
              title={category}
              products={categoryQueries[index]?.data || []}
            />
          ))}
      </div>

      <PartnerSection />
    </div>
  );
}
