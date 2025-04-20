import React from 'react';
import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span>Loading...</span>
    </div>
  </div>
);