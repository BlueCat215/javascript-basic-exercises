import { useEffect, useState } from "react";

const STORAGE_KEY = "recently-viewed";
const MAX_ITEMS = 8;

export const useTrackRecentlyViewed = (product) => {
  useEffect(() => {
    if (!product) return;
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = stored.filter((p) => p.id !== product.id);
    const next = [
      {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
      },
      ...filtered,
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [product]);
};

export const useRecentlyViewed = (excludeId) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setItems(stored.filter((p) => String(p.id) !== String(excludeId)));
  }, [excludeId]);
  return items;
};
