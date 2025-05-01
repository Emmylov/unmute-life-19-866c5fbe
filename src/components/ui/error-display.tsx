
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export interface ErrorDisplayProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  title, 
  message, 
  onRetry 
}) => {
  return (
    <div className="w-full p-6 rounded-lg border bg-red-50 border-red-200 text-center flex flex-col items-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-700 mb-2">{title}</h3>
      <p className="text-red-600 mb-4">{message}</p>
      
      {onRetry && (
        <Button 
          variant="outline" 
          className="border-red-300 hover:bg-red-100" 
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </div>
  );
};
