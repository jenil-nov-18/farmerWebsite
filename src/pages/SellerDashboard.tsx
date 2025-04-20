import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, Seller } from "@/types";
import { Plus, Loader2, Trash2, Eye, EyeOff, Edit } from "lucide-react";
import { toast } from "sonner";
import { categories } from "@/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { isSeller } = useAuthCheck();
  const { user } = useUser();

  useEffect(() => {
    // Redirect non-sellers to become-seller page
    if (!isSeller()) {
      navigate('/become-seller');
      return;
    }
  }, [isSeller, navigate]);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stockQuantity: 0,
    discount: 0,
    image: "",
    status: "draft",
    isPublic: false,
  });

  const loadProducts = useCallback(() => {
    const allProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
    const sellerProducts = allProducts.filter(
      (p: Product) => p.seller.id === user?.id && p.status !== "deleted"
    );
    setProducts(sellerProducts);
  }, [user?.id]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingProduct(true);
  
    try {
      const seller: Seller = {
        id: user?.id || "",
        name: user?.fullName || "Unknown Seller",
        email: user?.primaryEmailAddress?.emailAddress || "",
      };
  
      const allProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
  
      if (editingProduct) {
        // Update existing product
        const updatedProduct = {
          ...editingProduct,
          ...newProduct,
          seller,
          updatedAt: new Date().toISOString(),
        };
  
        const updatedProducts = allProducts.map((p: Product) =>
          p.id === editingProduct.id ? updatedProduct : p
        );
  
        localStorage.setItem("sellerProducts", JSON.stringify(updatedProducts));
        toast.success("Product updated successfully!");
      } else {
        // Create new product
        const product: Product = {
          ...newProduct as Product,
          id: crypto.randomUUID(),
          seller,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublic: false,
          status: "draft",
          rating: 0,
          reviews: 0,
        };
  
        localStorage.setItem(
          "sellerProducts",
          JSON.stringify([...allProducts, product])
        );
        toast.success("Product added successfully!");
      }
  
      resetForm();
      loadProducts();
    } catch (error) {
      toast.error(editingProduct ? "Failed to update product" : "Failed to add product");
    } finally {
      setIsAddingProduct(false);
    }
  };

  const toggleProductVisibility = async (product: Product) => {
    try {
      const allProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
  
      const updatedProducts = allProducts.map((p: Product) =>
        p.id === product.id
          ? {
              ...p,
              isPublic: !p.isPublic,
              status: !p.isPublic ? "published" : "unpublished",
              updatedAt: new Date().toISOString(),
            }
          : p
      );
  
      localStorage.setItem("sellerProducts", JSON.stringify(updatedProducts));
      loadProducts();
      toast.success(
        `Product ${!product.isPublic ? "published" : "unpublished"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update product visibility");
    }
  };
  
  const handleDeleteProduct = async (product: Product) => {
    try {
      const allProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
  
      const updatedProducts = allProducts.filter((p: Product) => p.id !== product.id);
  
      localStorage.setItem("sellerProducts", JSON.stringify(updatedProducts));
      loadProducts();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };
  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      category: "",
      stockQuantity: 0,
      discount: 0,
      image: "",
      status: "draft",
      isPublic: false,
    });
    setEditingProduct(null);
  };

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your products and track sales
          </p>
        </div>

        <Dialog onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button className="bg-agro-green-600 hover:bg-agro-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOrUpdateProduct} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) =>
                      setNewProduct({ ...newProduct, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    required
                    min="0"
                    value={newProduct.stockQuantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stockQuantity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={newProduct.discount}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        discount: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    required
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    required
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isAddingProduct}>
                  {isAddingProduct && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant={
                    product.status === "published"
                      ? "default"
                      : product.status === "draft"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleProductVisibility(product)}
                  >
                    {product.isPublic ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProduct(product)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {product.category}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-medium text-agro-green-600">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Stock: {product.stockQuantity}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-6">
            Start adding products to your store
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;