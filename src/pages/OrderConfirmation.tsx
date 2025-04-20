// Create this file at src/pages/OrderConfirmation.jsx

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;
  
  // If no order data is passed, show generic confirmation
  if (!order) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="text-center py-16">
            <div className="bg-green-100 inline-flex p-4 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-agro-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. We've received your order.
            </p>
            <Button size="lg" className="bg-agro-green-600 hover:bg-agro-green-700" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show detailed order confirmation
  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <div className="text-center py-8">
          <div className="bg-green-100 inline-flex p-4 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-agro-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been received and is being processed.
          </p>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Summary
              </h2>
              <span className="text-sm text-muted-foreground">
                Order ID: {order.razorpayPaymentId}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <ul className="divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="py-3 flex justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border bg-muted mr-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            
            <div className="border-t mt-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            A confirmation email has been sent to {order.user.email}
          </p>
          <Button size="lg" className="bg-agro-green-600 hover:bg-agro-green-700" asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;