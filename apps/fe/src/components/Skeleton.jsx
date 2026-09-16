const Box = ({ className = "" }) => (
  <div className={`bg-line/60 rounded animate-pulse ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="bg-white border border-line rounded-lg p-3">
    <Box className="h-44 w-full mb-3 rounded-md" />
    <Box className="h-3 w-16 mb-2" />
    <Box className="h-4 w-full mb-1" />
    <Box className="h-4 w-2/3 mb-3" />
    <Box className="h-5 w-20" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-t border-line">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="p-3">
        <Box className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const ProductDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
    <Box className="aspect-square w-full rounded-lg" />
    <div className="space-y-4">
      <Box className="h-3 w-24" />
      <Box className="h-8 w-3/4" />
      <Box className="h-10 w-32" />
      <Box className="h-20 w-full" />
      <Box className="h-12 w-full" />
    </div>
  </div>
);
