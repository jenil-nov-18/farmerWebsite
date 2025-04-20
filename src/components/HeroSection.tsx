import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, BookOpen } from "lucide-react";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const HeroSection = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { checkAuth } = useAuthCheck();

  const handleSellerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (checkAuth('/become-seller')) {
      navigate('/become-seller');
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-agro-green-700 to-agro-green-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/Homepage.jpeg')] opacity-20 bg-cover bg-center" />
      
      <div className="container-custom relative z-10 py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-4 items-center md:grid md:grid-cols-2 md:gap-4">
          {/* Image Section */}
          <div className="order-1 flex justify-center md:order-2">
            <div className="relative">
              <div className="absolute -inset-1 md:-inset-2 rounded-full bg-white/10 blur-md" />
              <img
                src="/images/HomepagBackgroundimg.jpg"
                alt="Farmer with fresh produce"
                className="relative z-10 rounded-lg shadow-xl object-contain h-40 sm:h-48 md:h-[28rem] lg:h-[32rem]"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="text-center md:text-left text-white space-y-3 md:space-y-3 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight animate-slide-in-left">
              Grow Your Farm Business
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 max-w-md mx-auto md:mx-4 animate-fade-in-delayed">
              Buy and sell farm products directly while learning sustainable farming practices all in one place.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 via-green-400 to-green-600 text-white font-bold shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out rounded-full px-6 py-3"
                asChild
              >
                <Link to="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Products
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out rounded-full px-6 py-3"
                asChild
              >
                <Link to="/learn">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Learning
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 text-white font-bold shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out rounded-full px-6 py-3"
                onClick={handleSellerClick}
              >
                Become a Seller
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
