import { validatePaymentInfo } from '@/lib/validation';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000';

class PaymentService {
  static async createOrder(amount) {
    try {
      const validation = validatePaymentInfo({
        amount,
        currency: 'INR',
        orderId: `order_${Date.now()}`
      });

      if (!validation.isValid) {
        const errors = Object.values(validation.errors);
        errors.forEach(error => toast.error(error));
        throw new Error('Invalid payment information');
      }

      const response = await fetch(`${API_BASE_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Math.round(amount) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment service error:', error);
      throw error;
    }
  }

  static async verifyPayment(paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  static async getTransactionHistory(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await fetch(`${API_BASE_URL}/transactions/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transaction history');
      }

      return await response.json();
    } catch (error) {
      console.error('Transaction history error:', error);
      throw error;
    }
  }

  static formatAmount(amount) {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount);
    } catch (error) {
      console.error('Amount formatting error:', error);
      return `₹${amount.toFixed(2)}`;
    }
  }

  static validatePaymentResponse(response) {
    if (!response?.razorpay_payment_id || 
        !response?.razorpay_order_id || 
        !response?.razorpay_signature) {
      throw new Error('Invalid payment response');
    }
    return true;
  }
}

export default PaymentService;