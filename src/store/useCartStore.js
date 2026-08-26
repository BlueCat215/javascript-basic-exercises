import { create } from "zustand";
import { persist } from "zustand/middleware";

const updateCartTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return { totalItems, totalPrice };
};

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),
      setTotals: (totals) => set(totals),

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          const newItems = existing
            ? state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
              )
            : [
                ...state.items,
                {
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  quantity: 1,
                },
              ];
          return { items: newItems, ...updateCartTotals(newItems) };
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          return { items: newItems, ...updateCartTotals(newItems) };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i,
          );
          return { items: newItems, ...updateCartTotals(newItems) };
        }),

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: "app-cart-storage",
      partialize: (state) => ({ items: state.items }),

      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        const totals = updateCartTotals(state.items);
        state.setTotals(totals);
        state.setHasHydrated(true);
      },
    },
  ),
);
