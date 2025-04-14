
import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "default" | "purple" | "white";
  fullPage?: boolean;
  text?: string;
}

export const LoadingSpinner = ({
  size = "medium",
  color = "default",
  fullPage = false,
  text
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: "h-5 w-5 border-2",
    medium: "h-8 w-8 border-2",
    large: "h-12 w-12 border-4"
  };
  
  const colorClasses = {
    default: "border-gray-300 border-t-gray-800",
    purple: "border-unmute-purple/30 border-t-unmute-purple",
    white: "border-white/30 border-t-white"
  };
  
  const spinner = (
    <div className="flex flex-col items-center justify-center" aria-live="polite">
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin rounded-full`} 
        role="status"
        aria-label={text || "Loading"}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-500">
          {text}
        </p>
      )}
    </div>
  );
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50" role="alert" aria-busy="true">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};

export default LoadingSpinner;
