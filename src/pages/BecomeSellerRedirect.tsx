import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { StoreIcon } from "lucide-react";

const BecomeSellerRedirect = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // Get isSeller status from user metadata
  const isSeller = user?.publicMetadata?.isSeller as boolean;

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agro-green-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSeller) {
    // If already a seller, redirect to seller dashboard
    navigate("/seller-dashboard", { replace: true });
    return null;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Icon Section */}
          <div className="flex justify-center mb-8">
            <div className="bg-agro-green-100 dark:bg-agro-green-900/30 p-4 rounded-full">
              <StoreIcon className="h-12 w-12 text-agro-green-600" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold mb-4">Start Selling with Us</h1>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto">
              Join our community of farmers and start selling your products directly to customers.
            </p>
          </div>

          {/* Action Button */}
          <Button 
            size="lg"
            onClick={() => navigate("/become-seller")}
            className="bg-agro-green-600 hover:bg-agro-green-700 text-white px-8 py-6 text-lg h-auto"
          >
            Register as Seller
          </Button>

          {/* Additional Info */}
          <p className="text-sm text-muted-foreground mt-6">
            You'll be able to list your products and manage your store after registration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BecomeSellerRedirect;