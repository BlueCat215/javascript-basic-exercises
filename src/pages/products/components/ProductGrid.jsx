import { ProductCard } from "../../../components/ProductCard";
import { Pagination } from "../../../components/Pagination";
import { ErrorState, EmptyState } from "../../../components/StatusState";
import { ProductGridSkeleton } from "../../../components/Skeleton";

export function ProductGrid({
  isLoading,
  isError,
  data,
  pageSize,
  onPageChange,
}) {
  if (isLoading) return <ProductGridSkeleton count={pageSize} />;
  if (isError) return <ErrorState message="Không tải được sản phẩm" />;
  if (!data || data.items.length === 0) return <EmptyState />;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 mb-8">
        {data.items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
