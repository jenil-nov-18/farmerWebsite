import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';
import { CartContext, CartItem } from './cart-context';


const MAX_QUANTITY_PER_ITEM = 10;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return [];

      const parsedCart = JSON.parse(savedCart);
      if (!Array.isArray(parsedCart)) {
        console.error('Invalid cart data format');
        return [];
      }

      // Validate each cart item
      return parsedCart.filter((item: Partial<CartItem>) => {
        const isValid = 
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.price === 'number' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0;

        if (!isValid) {
          console.error('Invalid cart item:', item);
        }
        return isValid;
      }) as CartItem[];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const [subtotal, setSubtotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      const total = cart.reduce((sum, item) => {
        const itemTotal = item.price * item.quantity;
        // Validate the calculation
        if (isNaN(itemTotal) || !isFinite(itemTotal)) {
          console.error('Invalid price calculation for item:', item);
          return sum;
        }
        return sum + itemTotal;
      }, 0);
      setSubtotal(total);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      toast.error('Failed to save cart. Please try again.');
    }
  }, [cart]);

  const checkLocalStock = (product: Product, requestedQuantity: number): boolean => {
    try {
      const sellerProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
      const allProducts = [...sellerProducts];

      const storedProduct = allProducts.find(p => p.id === product.id) || product;

      const cartItem = cart.find(item => item.id === product.id);
      const currentCartQuantity = cartItem ? cartItem.quantity : 0;

      return (storedProduct.stockQuantity - currentCartQuantity) >= requestedQuantity;
    } catch (error) {
      console.error('Error checking stock:', error);
      return false;
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      setIsLoading(true);

      // Validate product data
      if (!product?.id || !product?.name || typeof product?.price !== 'number') {
        toast.error("Invalid product data");
        return;
      }

      if (quantity <= 0) {
        toast.error("Invalid quantity");
        return;
      }

      if (!checkLocalStock(product, quantity)) {
        toast.error("Sorry, not enough stock available");
        return;
      }

      const existingItem = cart.find(item => item.id === product.id);
      const newQuantity = (existingItem?.quantity || 0) + quantity;

      // Final validation before updating cart
      if (newQuantity > MAX_QUANTITY_PER_ITEM) {
        toast.error(`Maximum quantity per item is ${MAX_QUANTITY_PER_ITEM}`);
        return;
      }

      if (existingItem) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        ));
        toast.success(`Updated quantity in cart: ${product.name}`);
      } else {
        setCart([...cart, { ...product, quantity }]);
        toast.success(`Added to cart: ${product.name}`);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (productId: string) => {
    if (!productId) {
      console.error('Invalid product ID for removal');
      return;
    }

    try {
      const removedProduct = cart.find(item => item.id === productId);
      setCart(cart.filter(item => item.id !== productId));
      
      if (removedProduct) {
        toast.info(`Removed from cart: ${removedProduct.name}`);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);

      if (!productId || typeof quantity !== 'number' || quantity < 0) {
        toast.error("Invalid quantity or product ID");
        return;
      }

      const product = cart.find(item => item.id === productId);
      
      if (!product) {
        toast.error("Product not found in cart");
        return;
      }

      if (quantity > MAX_QUANTITY_PER_ITEM) {
        toast.error(`Maximum quantity per item is ${MAX_QUANTITY_PER_ITEM}`);
        return;
      }

      if (!checkLocalStock(product, quantity)) {
        toast.error("Sorry, not enough stock available");
        return;
      }

      if (quantity === 0) {
        removeFromCart(productId);
      } else {
        setCart(cart.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        ));
        toast.success(`Updated quantity for ${product.name}`);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    try {
      setCart([]);
      localStorage.removeItem('cart');
      toast.info("Cart cleared");
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart. Please try again.');
    }
  };

  const totalItems = cart.reduce((total, item) => {
    // Validate the calculation
    if (typeof item.quantity !== 'number' || isNaN(item.quantity)) {
      console.error('Invalid quantity for item:', item);
      return total;
    }
    return total + item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
};
