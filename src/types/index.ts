export interface Seller {
  id: string;
  name: string;
  email: string;
  businessName?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  image: string;
  seller: Seller;
  discount: number;
  isPublic: boolean;
  status: 'draft' | 'published' | 'unpublished' | 'deleted';
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
  featured?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  topics: string[];
  rating?: number;
  students?: number;
  featured?: boolean;
  free?: boolean;
}

export interface OrderItem extends Product {
  quantity: number;
  orderedPrice: number; // Price at the time of order
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone?: string;
  isSeller: boolean;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  count?: number;
}

// Utility type for form validation
export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, unknown>;
  theme?: {
    color?: string;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  error?: {
    description: string;
    code: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, callback: (response: RazorpayPaymentResponse) => void): void;
}
