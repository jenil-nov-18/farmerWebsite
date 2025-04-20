import { useContext } from 'react';
import { CartContext } from '@/contexts/cart-context';

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error(
      'useCart must be used within a CartProvider. ' +
      'Wrap a parent component in <CartProvider> to fix this error.'
    );
  }

  return context;
};