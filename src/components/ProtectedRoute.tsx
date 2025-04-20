import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSeller?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireSeller = false 
}) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-agro-green-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    toast.error("Please sign in to continue");
    return (
      <Navigate
        to="/login"
        state={{ redirectTo: location.pathname }}
        replace
      />
    );
  }

  if (requireSeller && (!user?.publicMetadata?.isSeller)) {
    toast.error("This page is only accessible to sellers");
    return (
      <Navigate
        to="/become-seller"
        state={{ redirectTo: location.pathname }}
        replace
      />
    );
  }

  try {
    // Ensure children are rendered correctly
    return <React.Fragment>{children}</React.Fragment>;
  } catch (error) {
    console.error("Error rendering ProtectedRoute children:", error);
    toast.error("An unexpected error occurred. Please try again later.");
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }
};

export default ProtectedRoute;