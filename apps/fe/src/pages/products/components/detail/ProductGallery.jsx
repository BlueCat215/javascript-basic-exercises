export const ProductGallery = ({ product }) => {
  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="relative w-full aspect-3/4 flex items-center justify-center p-6 group ">
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-ink text-white text-xs font-bold px-3 py-1 rounded">
            NEW
          </span>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="object-contain h-full w-full mix-blend-multiply"
        />
      </div>
      <div className="flex gap-4">
        <div className="w-20 h-24 bg-neutral-50 rounded-lg border border-ink shrink-0 flex items-center justify-center p-2 cursor-pointer transition-colors">
          <img
            src={product.image}
            alt="thumb"
            className="object-contain h-full w-full mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  );
};
