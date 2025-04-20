import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, LogIn, Store } from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isSignedIn, isLoaded } = useUser();
  const { checkAuth, checkSellerAuth, isSeller } = useAuthCheck();

  const handleSellerClick = () => {
    if (isSeller()) {
      navigate('/seller-dashboard');
    } else {
      checkSellerAuth('/become-seller');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  if (!isLoaded) {
    return null; // Or show a loading spinner
  }

  return (
    <nav className="border-b">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl">
            Farmfinity
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {[
                { path: "/", label: "Home" },
                { path: "/shop", label: "Shop" },
                { path: "/learn", label: "Learn" },
              ].map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-agro-green-600"
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side - Cart, Login, Theme Toggle, Auth */}
        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:text-agro-green-600"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-agro-green-600 text-xs text-white flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {!isSignedIn && (
            <Button
              onClick={handleLoginClick}
              variant="ghost"
              className="flex items-center gap-2 hover:text-agro-green-600 hover:bg-agro-green-50 dark:hover:bg-agro-green-900/30"
            >
              <LogIn className="h-5 w-5" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}

          <Button
            onClick={handleSellerClick}
            className="bg-agro-green-600 hover:bg-agro-green-700 text-white flex items-center gap-2"
          >
            <Store className="mr-2 h-4 w-4" />
            {isSeller() ? "Seller Dashboard" : "Become a Seller"}
          </Button>

          {isSignedIn && (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                  userButtonTrigger: "focus:shadow-[0_0_0_2px_#16a34a]"
                }
              }}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;