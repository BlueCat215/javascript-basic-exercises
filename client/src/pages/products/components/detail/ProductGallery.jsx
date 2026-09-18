import { useState } from "react";
import { ImageWithSkeleton } from "../../../../components/ImageWithSkeleton";
import { imageUrl } from "../../../../utils/imageUrl";

export const ProductGallery = ({ product }) => {
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = imageUrl(images[activeIndex] ?? "");

  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="relative w-full aspect-3/4 group">
        {product.isNew && (
          <span className="absolute top-4 left-4 z-10 bg-ink text-white text-xs font-bold px-3 py-1 rounded">
            NEW
          </span>
        )}
        <ImageWithSkeleton
          src={activeSrc}
          alt={product.title}
          className="absolute inset-0"
          imgClassName="object-contain p-6 mix-blend-multiply"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-24 rounded-lg border-2 shrink-0 overflow-hidden transition-colors ${
                i === activeIndex
                  ? "border-ink"
                  : "border-line hover:border-ink/40"
              }`}
            >
              <ImageWithSkeleton
                src={imageUrl(img)}
                alt={`Ảnh ${i + 1}`}
                className="absolute inset-0 rounded-lg"
                imgClassName="object-contain p-2 mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}

      {images.length === 1 && (
        <div className="flex gap-4">
          <div className="relative w-20 h-24 bg-neutral-50 rounded-lg border border-ink shrink-0 overflow-hidden">
            <ImageWithSkeleton
              src={imageUrl(images[0])}
              alt="thumb"
              className="absolute inset-0 rounded-lg"
              imgClassName="object-contain p-2 mix-blend-multiply"
            />
          </div>
        </div>
      )}
    </div>
  );
};
