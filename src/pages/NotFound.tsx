
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-agro-green-100 dark:bg-agro-green-900/30 mb-6">
          <Leaf className="h-10 w-10 text-agro-green-600" />
        </div>
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.
        </p>
        <Button asChild className="bg-agro-green-600 hover:bg-agro-green-700">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
