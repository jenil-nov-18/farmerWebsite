import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Store } from "lucide-react";
import axios from "axios";

const BecomeSeller = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isSeller } = useAuthCheck();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
    address: "",
    description: ""
  });

  useEffect(() => {
    // If already a seller, redirect to dashboard
    if (isSeller()) {
      navigate('/seller-dashboard');
      return;
    }
  }, [isSeller, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (data: typeof formData): boolean => {
    if (!data.businessName.trim()) {
      toast.error("Business name is required");
      return false;
    }

    if (!data.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(data.phoneNumber.trim())) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    if (!data.address.trim()) {
      toast.error("Business address is required");
      return false;
    }

    if (!data.description.trim()) {
      toast.error("Business description is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!validateForm(formData)) {
        return;
      }

      setIsSubmitting(true);

      if (!user) {
        toast.error("User not authenticated. Please sign in and try again.");
        return;
      }

      // Ensure server is available before proceeding
      try {
        await axios.get("https://backendfarmer-vpe9.onrender.com/health");
      } catch (error) {
        toast.error("Server is not available. Please try again later.");
        return;
      }

      // Update seller metadata
      await axios.post("https://backendfarmer-vpe9.onrender.com/update-seller", {
        userId: user.id,
        metadata: {
          isSeller: true,
          businessName: formData.businessName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          address: formData.address.trim(),
          description: formData.description.trim(),
          registeredAt: new Date().toISOString()
        }
      });

      await user.reload();
      
      toast.success("Successfully registered as a seller!");
      navigate("/seller-dashboard");
    } catch (error: unknown) {
      console.error("Failed to register as seller:", error);
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || "Failed to register as seller";
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-custom max-w-2xl mt-16 mb-16">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-agro-green-100 dark:bg-agro-green-900/30 p-4 rounded-full">
            <Store className="h-12 w-12 text-agro-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Become a Seller</h1>
        <p className="text-muted-foreground">
          Join our community of farmers and start selling your products directly to customers.
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="businessName" className="text-sm font-medium">
              Business Name
            </label>
            <Input
              id="businessName"
              name="businessName"
              required
              placeholder="Your farm or business name"
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              placeholder="Your contact number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Business Address
            </label>
            <Textarea
              id="address"
              name="address"
              required
              placeholder="Your business address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Business Description
            </label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Tell us about your farm and products"
              className="min-h-[100px]"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-agro-green-600 hover:bg-agro-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BecomeSeller;
