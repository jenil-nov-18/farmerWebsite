import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

const loadRazorpayScript = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
};

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  error?: {
    description: string;
    code: string;
  };
}

interface OrderData {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

const UnifiedCheckout: React.FC = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tax = subtotal * 0.1;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + tax + shipping;

  const createOrder = async (total: number) => {
    const response = await fetch("https://backendfarmer-6xty.onrender.com/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: Math.round(total * 100) }),
    });

    if (!response.ok) throw new Error("Failed to create order");
    const data = await response.json();
    return data;
  };

  const handlePaymentFailure = useCallback((response: RazorpayPaymentResponse) => {
    console.error("Payment failed:", response);
    alert(`Payment failed: ${response.error?.description || "Unknown error"}`);
    navigate("/transaction-failed", { state: { reason: "Payment failed or canceled" } });
  }, [navigate]);

  const handlePaymentSuccess = useCallback(async (
    response: RazorpayPaymentResponse,
    orderData: OrderData
  ) => {
    try {
      const order = {
        id: orderData.id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        items: cart,
        subtotal,
        tax,
        shipping,
        total,
        user: {
          id: user.id,
          name: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.primaryEmailAddress?.emailAddress,
        },
        status: "completed",
        createdAt: new Date().toISOString(),
      };

      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      clearCart();
      navigate("/order-confirmation", { state: { order } });
    } catch (error) {
      console.error("Error handling payment success:", error);
      alert("Payment was successful, but there was an error processing your order.");
    }
  }, [cart, subtotal, tax, shipping, total, user, clearCart, navigate]);

  const processPayment = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSignedIn) {
        navigate("/sign-in");
        return;
      }

      await loadRazorpayScript();
      const orderData: OrderData = await createOrder(total);

      const userDetails = {
        name: user.fullName || `${user.firstName} ${user.lastName}`,
        email: user.primaryEmailAddress?.emailAddress || "",
        contact: user.phoneNumbers?.[0]?.phoneNumber || "",
      };

      const options: RazorpayOptions = {
        key: "rzp_test_ul5pWeYG5L7mBM",
        amount: Math.round(total * 100),
        currency: "INR",
        name: "AgroLearn Commerce",
        description: "Purchase of agricultural products",
        order_id: orderData.id,
        prefill: userDetails,
        notes: {
          address: "AgroLearn Commerce Corporate Office",
        },
        theme: {
          color: "#3CB371",
        },
        handler: (response: RazorpayPaymentResponse) => {
          handlePaymentSuccess(response, orderData);
        },
        modal: {
          ondismiss: () => {
            console.log("Payment gateway closed by user.");
            navigate("/transaction-failed", { state: { reason: "Payment canceled by user" } });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response: RazorpayPaymentResponse) => {
        console.error("Payment failed:", response);
        navigate("/transaction-failed", { state: { reason: "Payment failed" } });
      });
      razorpay.open();
    } catch (error) {
      console.error("Payment process failed:", error);
      setError("Unable to process payment. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, navigate, user, total, handlePaymentSuccess]);

  useEffect(() => {
    processPayment();
  }, [processPayment]);

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <div className="text-center py-16">
          {isLoading ? (
            <>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Processing Your Payment...</h1>
              <p className="text-muted-foreground mb-6">Please wait while we connect you to our secure payment gateway.</p>
              <div className="loading-spinner"></div>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Redirecting to Payment Gateway...</h1>
              <p className="text-muted-foreground mb-6">
                Please wait while we connect you to our secure payment gateway.
              </p>
            </>
          )}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default UnifiedCheckout;