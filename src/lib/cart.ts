import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  slug: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          if (existing.quantity >= item.stock) return;
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, { ...item, quantity: 1 }] }));
        }
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, item) => {
          const price = item.salePrice ?? item.price;
          return sum + price * item.quantity;
        }, 0),

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "butik-cart" }
  )
);
