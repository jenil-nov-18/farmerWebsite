import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { validateProduct, validateQuantity, validatePrice } from "@/lib/validation";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart, isLoading } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate product data before adding to cart
    const validation = validateProduct(product);
    if (!validation.isValid) {
      console.error('Invalid product data:', validation.errors);
      toast.error('Invalid product data. Please try again later.');
      return;
    }

    if (!validateQuantity(product.stockQuantity)) {
      toast.error('Invalid stock quantity');
      return;
    }

    if (!validatePrice(product.price)) {
      toast.error('Invalid product price');
      return;
    }

    if (product.stockQuantity <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLiked(!isLiked);
      // Save liked state to localStorage
      const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
      if (isLiked) {
        localStorage.setItem('likedProducts', 
          JSON.stringify(likedProducts.filter((id: string) => id !== product.id))
        );
      } else {
        localStorage.setItem('likedProducts', 
          JSON.stringify([...likedProducts, product.id])
        );
      }
    } catch (error) {
      console.error('Error updating liked status:', error);
    }
  };

  // Load initial liked state
  React.useEffect(() => {
    try {
      const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
      setIsLiked(likedProducts.includes(product.id));
    } catch (error) {
      console.error('Error loading liked status:', error);
    }
  }, [product.id]);

  const isInCart = cart.some(item => item.id === product.id);
  const cartItem = cart.find(item => item.id === product.id);
  const remainingStock = Math.max(0, product.stockQuantity - (cartItem?.quantity || 0));

  // Calculate if product is new (within last 7 days)
  const isNew = React.useMemo(() => {
    try {
      return product.isNew || (
        new Date().getTime() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
      );
    } catch (error) {
      console.error('Error calculating isNew status:', error);
      return false;
    }
  }, [product.isNew, product.createdAt]);

  return (
    <Card className="card-hover overflow-hidden border border-border/40">
      <Link to={`/shop/product/${product.id}`}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-cover"
          />
          <div className="absolute left-2 top-2 flex flex-col gap-2">
            {product.discount > 0 && (
              <Badge
                className="bg-red-500"
                variant="secondary"
              >
                {product.discount}% OFF
              </Badge>
            )}
            {isNew && (
              <Badge
                className="bg-blue-500"
                variant="secondary"
              >
                NEW
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-2 top-2 rounded-full ${
              isLiked 
                ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600' 
                : 'bg-background/80 hover:bg-background'
            }`}
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <span className="text-sm text-muted-foreground">
              {product.category}
            </span>
            <h3 className="text-base font-medium line-clamp-2">
              {product.name}
            </h3>
            {product.seller && (
              <p className="text-xs text-muted-foreground mt-1">
                Sold by {product.seller.name}
              </p>
            )}
            <div className="flex items-center mt-1">
              {product.rating !== undefined && (
                <>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product.rating.toFixed(1)})
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-agro-green-600">
                ₹{product.price.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{((product.price * 100) / (100 - product.discount)).toFixed(2)}
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-agro-green-600 text-agro-green-600 hover:scale-105 transition-transform hover:border-agro-green-600 hover:text-agro-green-600 hover:bg-transparent"
              onClick={handleAddToCart}
              disabled={isAddingToCart || isLoading || remainingStock === 0}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  {isInCart ? 'Add More' : 'Add'}
                </>
              )}
            </Button>
          </div>
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className="text-xs text-red-500 mt-2">
              Only {remainingStock} left in stock!
            </p>
          )}
          {remainingStock === 0 && (
            <p className="text-xs text-red-500 mt-2">Out of stock</p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
