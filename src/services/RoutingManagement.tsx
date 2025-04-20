import React from 'react';
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation, Location } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const PROTECTED_ROUTES = [
  "/seller-dashboard",
  "/checkout",
  "/order-confirmation"
] as const;

type ProtectedRoute = typeof PROTECTED_ROUTES[number];

interface RoutingOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  isSeller?: boolean;
}

interface RoutingState {
  from: Location;
}

// Type-safe HOC for route protection
export const handleRouting = <P extends object>(
  Component: React.ComponentType<P>,
  options: RoutingOptions = {}
) => {
  const ProtectedRoute: React.FC<P> = (props) => {
    const { user, isLoaded, isSignedIn } = useUser();
    const location = useLocation();
    const { requireAuth = false, redirectTo = "/login", isSeller = false } = options;

    // Show consistent loading state while auth is being checked
    if (!isLoaded) {
      return <LoadingSpinner />;
    }

    // First check: Authentication required
    if ((requireAuth || PROTECTED_ROUTES.includes(location.pathname as ProtectedRoute)) && !isSignedIn) {
      return <Navigate 
        to="/login"
        replace 
        state={{ from: location } as RoutingState} 
      />;
    }

    // Second check: Seller privileges (only if user is authenticated)
    if (isSignedIn && isSeller && !user?.unsafeMetadata?.isSeller) {
      return <Navigate 
        to="/become-seller" 
        replace 
        state={{ from: location } as RoutingState} 
      />;
    }

    // If all checks pass, render the component
    return <Component {...props} />;
  };

  // Preserve the display name for debugging
  ProtectedRoute.displayName = `Protected(${Component.displayName || Component.name || 'Component'})`;
  
  return ProtectedRoute;
};

// HOC for seller-only routes
export const withSellerAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return handleRouting(Component, {
    requireAuth: true,
    isSeller: true
  });
};

// HOC for buyer-only routes
export const withBuyerAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return handleRouting(Component, {
    requireAuth: true,
    redirectTo: "/login"
  });
};