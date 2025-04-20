import { createContext } from "react";
import { Product } from "@/types";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
}

const initialCartContext: CartContextType = {
  cart: [],
  addToCart: async () => {},
  removeFromCart: () => {},
  updateQuantity: async () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  isLoading: false,
};

export const CartContext = createContext<CartContextType>(initialCartContext);