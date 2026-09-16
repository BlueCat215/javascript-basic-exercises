import { ImageWithSkeleton } from "../../../../components/ImageWithSkeleton";

export const ProductGallery = ({ product }) => {
  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="relative w-full aspect-3/4 group">
        {product.isNew && (
          <span className="absolute top-4 left-4 z-10 bg-ink text-white text-xs font-bold px-3 py-1 rounded">
            NEW
          </span>
        )}
        <ImageWithSkeleton
          src={product.image}
          alt={product.title}
          className="absolute inset-0"
          imgClassName="object-contain p-6 mix-blend-multiply"
        />
      </div>
      <div className="flex gap-4">
        <div className="relative w-20 h-24 bg-neutral-50 rounded-lg border border-ink shrink-0 cursor-pointer transition-colors">
          <ImageWithSkeleton
            src={product.image}
            alt="thumb"
            className="absolute inset-0 rounded-lg"
            imgClassName="object-contain p-2 mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  );
};
