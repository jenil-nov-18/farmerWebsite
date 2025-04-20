import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuthCheck = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  const isSeller = (): boolean => {
    try {
      if (!isLoaded || !user) return false;
      
      const metadata = user.publicMetadata;
      if (!metadata || typeof metadata !== 'object') return false;
      
      return metadata.isSeller === true;
    } catch (error) {
      console.error('Error checking seller status:', error);
      return false;
    }
  };

  const checkAuth = (redirectPath: string): boolean => {
    try {
      if (!isLoaded) {
        toast.error("Loading user data...");
        return false;
      }

      if (!isSignedIn) {
        toast.error("Please sign in to continue");
        navigate('/login', {
          state: { redirectTo: redirectPath }
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error("Authentication error. Please try again.");
      return false;
    }
  };

  const checkSellerAuth = (redirectPath: string): boolean => {
    try {
      if (!checkAuth(redirectPath)) return false;

      if (!isSeller()) {
        toast.error("Please register as a seller first");
        navigate('/become-seller', {
          state: { redirectTo: redirectPath }
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking seller auth:', error);
      toast.error("Authentication error. Please try again.");
      return false;
    }
  };

  return {
    checkAuth,
    checkSellerAuth,
    isSeller,
  };
};