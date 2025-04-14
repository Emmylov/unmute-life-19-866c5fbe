
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({
  title = "Something went wrong",
  message = "We encountered an error while processing your request",
  onRetry
}: ErrorDisplayProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-red-50 border border-red-100 rounded-lg">
      <div className="flex flex-col items-center max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
