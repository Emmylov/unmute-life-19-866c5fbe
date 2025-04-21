
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
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    // Reset error state when location changes
    setError(null);
    setHasShownMessage(false);
    
    // Set a timeout to consider auth check complete even if stuck
    const timeoutId = setTimeout(() => {
      if (!authCheckComplete) {
        setAuthCheckComplete(true);
        console.warn("Auth check timed out, proceeding with available data");
      }
    }, 3000); // 3 seconds timeout
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [location.pathname]);
  
  // When auth state changes, mark check as complete
  useEffect(() => {
    if (!isLoading && !loading) {
      setAuthCheckComplete(true);
    }
  }, [isLoading, loading]);

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
    toast.info("Retrying...");
  };

  // Use either loading or isLoading - for backward compatibility
  const isAuthLoading = (loading || isLoading) && !authCheckComplete;

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
    if (!hasShownMessage && location.pathname !== '/' && location.pathname !== '/auth') {
      toast.error("Please log in to access this page");
      setHasShownMessage(true);
    }
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // If the user exists but hasn't completed onboarding and is not on the onboarding page
  if (user && !user.user_metadata?.is_onboarded && !location.pathname.includes('/onboarding')) {
    if (!hasShownMessage) {
      toast.info("Please complete your onboarding first", {
        description: "You're almost there!"
      });
      setHasShownMessage(true);
    }
    return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content or the Outlet for nested routes
  return <>{children || <Outlet />}</>;
};

export default ProtectedLayout;
