import { Product, ValidationResult } from "@/types";
import { CartItem } from "@/contexts/cart-context";

// Regular expressions for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s-]{10,}$/;
const POSTAL_CODE_REGEX = /^\d{6}$/; // Indian postal code format
const PRICE_REGEX = /^\d+(\.\d{1,2})?$/;

export const validateEmail = (email: string): boolean => {
  return Boolean(email && EMAIL_REGEX.test(email));
};

export const validatePhoneNumber = (phone: string): boolean => {
  return Boolean(phone && PHONE_REGEX.test(phone));
};

export const validatePostalCode = (postalCode: string): boolean => {
  return Boolean(postalCode && POSTAL_CODE_REGEX.test(postalCode));
};

export const validatePrice = (price: number): boolean => {
  if (typeof price !== 'number') return false;
  if (isNaN(price) || !isFinite(price)) return false;
  if (price < 0) return false;
  return PRICE_REGEX.test(price.toFixed(2));
};

export const validateQuantity = (quantity: number): boolean => {
  if (typeof quantity !== 'number') return false;
  if (isNaN(quantity) || !isFinite(quantity)) return false;
  return quantity >= 0 && Number.isInteger(quantity);
};

export const validateProduct = (product: Partial<Product>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!product?.id) {
    errors.id = "Product ID is required";
  }

  if (!product?.name?.trim()) {
    errors.name = "Product name is required";
  }

  if (!product?.description?.trim()) {
    errors.description = "Product description is required";
  }

  if (!validatePrice(product?.price || 0)) {
    errors.price = "Invalid product price";
  }

  if (!validateQuantity(product?.stockQuantity || 0)) {
    errors.stockQuantity = "Invalid stock quantity";
  }

  if (!product?.category?.trim()) {
    errors.category = "Product category is required";
  }

  if (!product?.seller?.id || !product?.seller?.name) {
    errors.seller = "Invalid seller information";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCartItem = (item: Partial<CartItem>): ValidationResult => {
  const errors: Record<string, string> = {};
  const productValidation = validateProduct(item);
  
  if (!productValidation.isValid) {
    errors.product = "Invalid product data";
    Object.assign(errors, productValidation.errors);
  }

  if (!validateQuantity(item?.quantity || 0)) {
    errors.quantity = "Invalid quantity";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateShippingInfo = (data: { fullName: string; address: string; city: string; state: string; postalCode: string; }): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.fullName?.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!data.address?.trim()) {
    errors.address = "Address is required";
  }

  if (!data.city?.trim()) {
    errors.city = "City is required";
  }

  if (!data.state?.trim()) {
    errors.state = "State is required";
  }

  if (!validatePostalCode(data.postalCode)) {
    errors.postalCode = "Valid postal code is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePaymentInfo = (data: { cardNumber: string; expiryDate: string; cvv: string; }): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.cardNumber?.trim()) {
    errors.cardNumber = "Card number is required";
  }

  if (!data.expiryDate?.trim()) {
    errors.expiryDate = "Expiry date is required";
  }

  if (!data.cvv?.trim()) {
    errors.cvv = "CVV is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};