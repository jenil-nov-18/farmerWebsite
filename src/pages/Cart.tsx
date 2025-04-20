import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { validatePrice, validateQuantity, validateCartItem } from "@/lib/validation";

const MAX_COUPON_ATTEMPTS = 3;

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    isLoading
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponAttempts, setCouponAttempts] = useState(0);
  const navigate = useNavigate();
  const { checkAuth } = useAuthCheck();

  // Validate cart items
  React.useEffect(() => {
    cart.forEach(item => {
      const validation = validateCartItem(item);
      if (!validation.isValid) {
        console.error('Invalid cart item:', item.id, validation.errors);
        removeFromCart(item.id);
        toast.error(`Removed invalid item from cart: ${item.name}`);
      }
    });
  }, [cart, removeFromCart]);

  const tax = validatePrice(subtotal * 0.1) ? subtotal * 0.1 : 0;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = validatePrice(subtotal + tax + shipping - discount) 
    ? subtotal + tax + shipping - discount 
    : 0;

  const handleCouponApply = () => {
    if (couponApplied) {
      toast.error("Coupon already applied");
      return;
    }

    if (couponAttempts >= MAX_COUPON_ATTEMPTS) {
      toast.error("Too many attempts. Please try again later.");
      return;
    }

    setCouponAttempts(prev => prev + 1);

    if (couponCode.toLowerCase().trim() === "silveroakunistudent") {
      const discountValue = validatePrice(subtotal * 0.1) ? subtotal * 0.1 : 0;
      setDiscount(discountValue);
      setCouponApplied(true);
      toast.success("10% discount applied successfully!");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    if (!validateQuantity(newQuantity)) {
      toast.error("Invalid quantity");
      return;
    }

    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error("Failed to update quantity");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!validatePrice(total) || total <= 0) {
      toast.error("Invalid total amount");
      return;
    }

    if (checkAuth('/checkout')) {
      navigate('/checkout');
    }
  };

  if (totalItems === 0) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="text-center py-16">
            <div className="bg-muted inline-flex p-4 rounded-full mb-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button
              size="lg"
              className="bg-agro-green-600 hover:bg-agro-green-700 transition-colors"
              asChild
            >
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom max-w-6xl mt-16">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground"
                onClick={clearCart}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Clear Cart
              </Button>
            </div>

            <ul className="divide-y">
              {cart.map((item) => (
                <li key={item.id} className="p-4">
                  <div className="flex items-start">
                    <div className="h-20 w-20 rounded-md border overflow-hidden bg-muted">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Sold by {item.seller.name}
                          </p>
                        </div>
                        <p className="text-base font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stockQuantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-flex items-center text-agro-green-600 hover:text-agro-green-800 transition-colors"
            >
              <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Summary & Coupon */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="couponCode" className="block text-sm font-medium mb-1">
                  Apply Coupon
                </label>
                <div className="flex gap-2">
                  <Input
                    id="couponCode"
                    placeholder="Enter coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className={`transition-all ${couponApplied ? "bg-muted text-muted-foreground" : ""}`}
                  />
                  <Button
                    onClick={handleCouponApply}
                    disabled={!couponCode || couponApplied}
                    className="bg-agro-green-600 hover:bg-agro-green-700"
                  >
                    {couponApplied ? (
                      <div>
                        <span className="flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4" /> Applied
                        </span>
                      </div>
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full bg-agro-green-600 hover:bg-agro-green-700"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
