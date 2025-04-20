import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser, UserButton, SignInButton } from "@clerk/clerk-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/hooks/useCart";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Button } from "@/components/ui/button";
import {
  Menu, X, ShoppingCart, Sun, Moon, Leaf,
  Search, Store
} from "lucide-react";
import { toast } from "react-toastify";

// First, add the interface for NavLink type
interface NavLink {
  name: string;
  path: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const { theme, setTheme } = useTheme();
  const { user, isSignedIn } = useUser();
  const { cart, totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { checkSellerAuth, isSeller, checkAuth } = useAuthCheck();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSellerNavigation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (checkAuth('/seller-dashboard')) {
        if (isSeller()) {
          navigate('/seller-dashboard');
        } else {
          navigate('/become-seller');
        }
      } else {
        toast.error('You need to log in to access this page.');
      }
    } catch (error) {
      console.error('Error during navigation:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  const getNavLinks = (): NavLink[] => {
    const baseLinks: NavLink[] = [
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
      { name: "Learn", path: "/learn" },
      { name: "About", path: "/about" },
    ];

    const sellLink: NavLink = {
      name: isSeller() ? "Sell Products" : "Become a Seller",
      path: "#",
      onClick: handleSellerNavigation
    };

    return [...baseLinks, sellLink];
  };

  const navLinks = getNavLinks();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Discount Banner */}
      {showBanner && (
        <div className="relative w-full bg-green-600 text-white text-sm text-center py-2 px-4 overflow-hidden">
          <button
            className="absolute right-4 top-2 transform -translate-y-0 bg-green-700 text-white rounded-full p-1 hover:bg-green-800 md:right-6 md:top-1/2 md:transform md:-translate-y-1/2 z-50"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              setShowBanner(false);
              localStorage.setItem('hideBanner', 'true');
            }}
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative inline-block animate-wave">
            🚨 Silver Oak University Students! Use coupon code 
            <span className="bg-white text-green-600 font-bold px-2 py-1 rounded-md shadow-md animate-pulse">
              silveroakunistudent
            </span> 
            to get a 10% discount on your order!
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container-custom flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-agro-green-600" />
            <span className="font-display text-xl font-bold text-foreground">
              Farmer<span className="text-agro-green-600">Selling</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={link.onClick}
                className={`text-sm font-medium transition-colors hover:text-agro-green-600 ${
                  isActive(link.path)
                    ? "text-agro-green-600"
                    : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              asChild
            >
              <Link to="/search" aria-label="Search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
              asChild
            >
              <Link to="/cart" aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-agro-green-600 text-[10px] font-medium text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>

            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button size="sm" variant="default" className="bg-agro-green-600 hover:bg-agro-green-700">
                  Sign In
                </Button>
              </SignInButton>
            )}

            <Button
              onClick={handleSellerNavigation}
              className="bg-agro-green-600 hover:bg-agro-green-700 text-white"
            >
              <Store className="mr-2 h-4 w-4" />
              {isSeller() ? "Seller Dashboard" : "Become a Seller"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative mr-2"
              asChild
            >
              <Link to="/cart" aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-agro-green-600 text-[10px] font-medium text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-foreground"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="container-custom space-y-4 pb-4 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => {
                    if (link.onClick) {
                      link.onClick(e);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`block py-2 text-base font-medium ${
                    isActive(link.path)
                      ? "text-agro-green-600"
                      : "text-foreground/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/search"
                className="flex items-center py-2 text-base font-medium text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Link>

              {user ? (
                <div className="flex items-center space-x-2 py-2">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-sm font-medium">My Account</span>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button size="sm" variant="default" className="w-full bg-agro-green-600 hover:bg-agro-green-700">
                    Sign In
                  </Button>
                </SignInButton>
              )}

              <Button
                onClick={handleSellerNavigation}
                className="w-full bg-agro-green-600 hover:bg-agro-green-700 text-white"
              >
                <Store className="mr-2 h-4 w-4" />
                {isSeller() ? "Seller Dashboard" : "Become a Seller"}
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
