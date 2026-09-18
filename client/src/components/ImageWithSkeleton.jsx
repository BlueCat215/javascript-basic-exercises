import { useState, useEffect, useRef } from "react";

export const ImageWithSkeleton = ({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  loading = "lazy",
  onLoad,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-line/60 transition-opacity duration-300 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100 animate-pulse"
        }`}
      />
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={() => setLoaded(true)}
        className={`w-full h-full transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
        {...rest}
      />
    </div>
  );
};
