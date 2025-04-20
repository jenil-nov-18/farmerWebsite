import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LogIn, Lock, ShieldCheck } from "lucide-react";

const LoginRedirect = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (isSignedIn) {
      navigate(from, { replace: true });
    }
  }, [isSignedIn, navigate, from]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Icon Section */}
          <div className="flex justify-center space-x-4 mb-8">
            <div className="bg-agro-green-100 dark:bg-agro-green-900/30 p-4 rounded-full">
              <LogIn className="h-12 w-12 text-agro-green-600" />
            </div>
            <div className="bg-agro-green-100 dark:bg-agro-green-900/30 p-4 rounded-full">
              <Lock className="h-12 w-12 text-agro-green-600" />
            </div>
            <div className="bg-agro-green-100 dark:bg-agro-green-900/30 p-4 rounded-full">
              <ShieldCheck className="h-12 w-12 text-agro-green-600" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto">
              Please sign in to {from.includes('checkout') ? 'complete your purchase' : 'continue to seller registration'}.
            </p>
          </div>

          {/* Login Button */}
          <SignInButton mode="modal">
            <Button 
              size="lg"
              className="bg-agro-green-600 hover:bg-agro-green-700 text-white px-8 py-6 text-lg h-auto"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In to Continue
            </Button>
          </SignInButton>

          {/* Additional Info */}
          <p className="text-sm text-muted-foreground mt-6">
            You will be redirected back to {from.includes('checkout') ? 'checkout' : 'seller registration'} after signing in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRedirect;