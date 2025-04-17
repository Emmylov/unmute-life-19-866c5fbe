
import React, { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import ErrorDisplay from "@/components/ui/error-display";

interface ProtectedLayoutProps {
  children?: ReactNode;
  redirectTo?: string;
  showLoading?: boolean;
}

/**
 * A layout component that protects routes requiring authentication
 * Shows consistent loading spinner and handles redirects
 */
const ProtectedLayout = ({ 
  children, 
  redirectTo = "/auth",
  showLoading = true
}: ProtectedLayoutProps) => {
  const { user, loading, isLoading } = useAuth();
  const location = useLocation();
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset error state when location changes
    setError(null);
  }, [location.pathname]);

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
    toast.info("Retrying...");
  };

  // Use either loading or isLoading - for backward compatibility
  const isAuthLoading = loading || isLoading;

  // While checking authentication, show a loading indicator
  if (isAuthLoading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" color="purple" text="Verifying access..." />
      </div>
    );
  }

  // If there was an error, show error display with retry option
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorDisplay
          title="Authentication Error"
          message={`We couldn't verify your access: ${error.message}`}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!user) {
    // Save the page they were trying to access
    toast.error("Please log in to access this page");
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content or the Outlet for nested routes
  return <>{children || <Outlet />}</>;
};

export default ProtectedLayout;
