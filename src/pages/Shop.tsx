import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { products as staticProducts, categories } from "@/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Search, SlidersHorizontal, X, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";

// Update the Product type to include the 'featured' property
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  discount?: number;
  isNew?: boolean;
  rating?: number;
  isPublic?: boolean;
  status?: string;
  featured?: boolean;
}

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const maxPrice = Math.max(...staticProducts.map((product) => product.price));
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    featured: false,
    newArrivals: false,
    onSale: false,
  });
  const [products, setProducts] = useState(staticProducts);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    try {
      const sellerProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
      const validSellerProducts = sellerProducts.filter((p: Product) => 
        p.isPublic && p.status === "published"
      );
  
      const validStaticProducts = staticProducts.filter(p => 
        p?.id && p?.name && typeof p?.price === 'number' && p?.category
      );
  
      setProducts([...validStaticProducts, ...validSellerProducts]);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(staticProducts); // Fallback to static products
    }
  }, []);

  useEffect(() => {
    try {
      // Load both static and seller products
      const sellerProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
      // Validate seller products data
      const validSellerProducts = sellerProducts.filter((p: Product) => {
        if (!p?.id || !p?.name || typeof p?.price !== 'number' || !p?.category) {
          console.error('Invalid product data:', p);
          return false;
        }
        return p.isPublic && p.status === "published";
      });
      
      // Validate static products
      const validStaticProducts = staticProducts.filter(p => 
        p?.id && p?.name && typeof p?.price === 'number' && p?.category
      );
      
      setProducts([...validStaticProducts, ...validSellerProducts]);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(staticProducts); // Fallback to static products
    }
  }, []);

  // Filter products by category, price range, and search query
  const filteredProducts = products.filter((product) => {
    try {
      const matchesCategory = activeCategory ? product.category === activeCategory : true;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = searchQuery
        ? (product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      const matchesFeatured = filters.featured ? !!product.featured : true;
      const matchesNewArrivals = filters.newArrivals ? !!product.isNew : true;
      const matchesOnSale = filters.onSale ? product.discount > 0 : true;

      return matchesCategory && matchesPrice && matchesSearch && 
             matchesFeatured && matchesNewArrivals && matchesOnSale;
    } catch (error) {
      console.error('Error filtering product:', product, error);
      return false;
    }
  });

  // Sort products with error handling
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    try {
      const aFeatured = a.featured || false;
      const bFeatured = b.featured || false;
      switch (sortOption) {
        case "price_low":
          return (a.price || 0) - (b.price || 0);
        case "price_high":
          return (b.price || 0) - (a.price || 0);
        case "newest":
          return a.isNew ? -1 : b.isNew ? 1 : 0;
        case "rating":
          return ((b.rating || 0) - (a.rating || 0));
        default: // "featured"
          return aFeatured === bFeatured ? 0 : aFeatured ? -1 : 1;
      }
    } catch (error) {
      console.error('Error sorting products:', error);
      return 0;
    }
  });

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Shop Farm Products</h1>
          <p className="text-muted-foreground mt-2">
            Fresh, organic products sourced directly from local farmers
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Button */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort:</span>
              <select
                className="text-sm border rounded px-2 py-1"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">All</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Filter Sidebar */}
          <div 
            className={`${
              showFilters ? "block animate-fade-in" : "hidden"
            } md:block md:w-64 lg:w-72 shrink-0`}
          >
            <div className="bg-card p-4 rounded-lg border shadow-sm divide-y divide-border">
              {/* Search */}
              <div className="pb-4">
                <h3 className="font-medium mb-2">Search</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Categories */}
              <div className="py-4">
                <h3 className="font-medium mb-2">Categories</h3>
                <ul className="space-y-1">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Button
                        variant="ghost"
                        className={`justify-start w-full text-left ${
                          activeCategory === category.name
                            ? "bg-agro-green-100 text-agro-green-800 dark:bg-agro-green-800/30 dark:text-agro-green-200"
                            : ""
                        }`}
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        {category.name}
                        
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Price Range */}
              <div className="py-4">
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  defaultValue={[0, maxPrice]}
                  max={maxPrice}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-6"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                  ₹{priceRange[0].toFixed(2)}
                  </span>
                  <span className="text-sm">
                  ₹{priceRange[1].toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Other Filters */}
              <div className="py-4">
                <h3 className="font-medium mb-2">Filter By</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={filters.featured}
                      onCheckedChange={() => handleFilterChange("featured")}
                    />
                    <label
                      htmlFor="featured"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Featured Products
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-arrivals"
                      checked={filters.newArrivals}
                      onCheckedChange={() => handleFilterChange("newArrivals")}
                    />
                    <label
                      htmlFor="new-arrivals"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      New Arrivals
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="on-sale"
                      checked={filters.onSale}
                      onCheckedChange={() => handleFilterChange("onSale")}
                    />
                    <label
                      htmlFor="on-sale"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      On Sale
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Mobile Close Button */}
              <div className="pt-4 md:hidden">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    setShowFilters(false);
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Desktop Sort Controls */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <div className="text-sm">
                Showing <span className="font-semibold">{sortedProducts.length}</span> products
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort by:</span>
                <select
                  className="text-sm border rounded px-2 py-1 bg-card text-foreground focus:outline-none"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">All</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            
            {/* Current Filters */}
            {(activeCategory || filters.featured || filters.newArrivals || filters.onSale || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {activeCategory}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setActiveCategory(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
                {filters.newArrivals && (
                  <Badge variant="secondary">New Arrivals</Badge>
                )}
                {filters.onSale && (
                  <Badge variant="secondary">On Sale</Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchQuery}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Store className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveCategory(null);
                    setSearchQuery("");
                    setFilters({
                      featured: false,
                      newArrivals: false,
                      onSale: false,
                    });
                    setPriceRange([0, maxPrice]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
