import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { ClerkProvider } from "@clerk/clerk-react";
import ProtectedRoute from "@/components/ProtectedRoute";

import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Learn from "./pages/Learn";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import UnifiedCheckout from '@/pages/UnifiedCheckout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import SellerDashboard from "./pages/SellerDashboard";
import LoginRedirect from "./pages/LoginRedirect";
import BecomeSellerRedirect from "./pages/BecomeSellerRedirect";
import BecomeSeller from "@/pages/BecomeSeller";
import TransactionFailed from '@/pages/TransactionFailed';

const CLERK_PUBLISHABLE_KEY = "pk_test_bGVuaWVudC1waXBlZmlzaC0zLmNsZXJrLmFjY291bnRzLmRldiQ";

const queryClient = new QueryClient();

const App = () => (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <CartProvider>
          <TooltipProvider>
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<LoginRedirect />} />
                  <Route
                    path="/checkout"
                    element={<UnifiedCheckout />}
                  />
                  <Route
                    path="/order-confirmation"
                    element={
                      <ProtectedRoute>
                        <OrderConfirmation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/become-seller-redirect"
                    element={
                      <ProtectedRoute>
                        <BecomeSellerRedirect />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/become-seller"
                    element={
                      <ProtectedRoute>
                        <BecomeSeller />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/seller-dashboard"
                    element={
                      <ProtectedRoute requireSeller={true}>
                        <SellerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transaction-failed"
                    element={<TransactionFailed />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
