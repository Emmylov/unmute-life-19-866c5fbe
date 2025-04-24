
import React, { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import ErrorDisplay from "@/components/ui/error-display";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { getCurrentUserWithTimeout } from "@/services/auth-service";

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
  const { user, profile, loading, isLoading } = useAuth();
  const location = useLocation();
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [directAuthCheck, setDirectAuthCheck] = useState<any>(null);
  const [forceShowContent, setForceShowContent] = useState(false);

  useEffect(() => {
    // Reset state when location changes
    setError(null);
    setHasShownMessage(false);
    setLoadingTimeout(false);
    setDirectAuthCheck(null);
    
    // Set a timeout to consider auth check complete even if stuck
    const timeoutId = setTimeout(() => {
      if (!authCheckComplete) {
        setAuthCheckComplete(true);
        setLoadingTimeout(true);
        console.log("Auth check timed out, proceeding with available data");
      }
    }, 5000); // 5 seconds timeout
    
    // Try to get user directly as a backup
    const checkUserDirectly = async () => {
      try {
        const directUser = await getCurrentUserWithTimeout();
        setDirectAuthCheck(directUser);
      } catch (error) {
        console.warn("Direct auth check failed:", error);
      }
    };
    
    // Start direct check if we don't have user data yet
    if (!user && !directAuthCheck) {
      checkUserDirectly();
    }
    
    // Force show content after a longer timeout as final fallback
    const forceShowTimeout = setTimeout(() => {
      setForceShowContent(true);
    }, 8000); // 8 seconds max wait
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(forceShowTimeout);
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
    setLoadingTimeout(false);
    setAuthCheckComplete(false);
    setDirectAuthCheck(null);
    toast.info("Retrying...");
    // Force refresh auth data
    window.location.reload();
  };

  // Use either loading or isLoading - for backward compatibility
  const isAuthLoading = (loading || isLoading) && !authCheckComplete && !forceShowContent;

  // If we hit the timeout but have user data already (from any source), continue
  const hasUserData = user || directAuthCheck;
  
  if (loadingTimeout && hasUserData) {
    console.log("Loading timed out but user exists, continuing");
  } 
  // If we hit the timeout without user data, show retry option
  else if (loadingTimeout && !hasUserData && !forceShowContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Connection Issue</h2>
        <p className="text-gray-600 mb-6 text-center">
          We're having trouble verifying your access.
          This could be due to network connectivity issues.
        </p>
        <Button 
          onClick={handleRetry}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  // While checking authentication, show a loading indicator
  if (isAuthLoading && showLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="large" color="purple" text="Verifying access..." />
        <p className="text-gray-500 mt-2 text-sm">This should only take a moment...</p>
      </div>
    );
  }

  // If there was an error, show error display with retry option
  if (error && !forceShowContent) {
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

  // If not authenticated (from any source) and not forced to show content, redirect to login page
  if (!user && !directAuthCheck && !forceShowContent) {
    // Save the page they were trying to access
    if (!hasShownMessage && location.pathname !== '/' && location.pathname !== '/auth') {
      toast.error("Please log in to access this page");
      setHasShownMessage(true);
    }
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Use either the auth context user or our direct check result
  const effectiveUser = user || directAuthCheck;
  
  // Check onboarding status using both user metadata and profile data for reliability
  const isOnboarded = 
    (effectiveUser?.user_metadata?.is_onboarded) || 
    (profile?.is_onboarded) || 
    // If profile has basic data, consider them onboarded as a fallback
    (profile && (profile.username || profile.full_name || profile.bio));
  
  // Only redirect to onboarding if explicitly not onboarded and not already on onboarding page
  if (effectiveUser && !isOnboarded && !location.pathname.includes('/onboarding') && !forceShowContent) {
    if (!hasShownMessage) {
      toast.info("Please complete your onboarding first", {
        description: "You're almost there!"
      });
      setHasShownMessage(true);
    }
    return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
  }

  // If authenticated or forced to show content, render the protected content or the Outlet for nested routes
  return <>{children || <Outlet />}</>;
};

export default ProtectedLayout;
