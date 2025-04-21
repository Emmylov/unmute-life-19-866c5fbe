
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

const ProtectedLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  useEffect(() => {
    // Reset the flag when location changes
    setHasShownMessage(false);
    
    // Set a reasonable timeout to consider auth check complete even if stuck
    const timeoutId = setTimeout(() => {
      if (!authCheckComplete) {
        setAuthCheckComplete(true);
        console.warn("Auth check timed out, proceeding with available data");
      }
    }, 5000); // 5 seconds timeout
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [location.pathname]);
  
  // When auth state changes, mark check as complete
  useEffect(() => {
    if (!isLoading) {
      setAuthCheckComplete(true);
    }
  }, [isLoading]);
  
  // While checking authentication, show a loading indicator
  if (isLoading && !authCheckComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner size="large" color="primary" text="Verifying your access..." />
        <p className="text-sm text-gray-500 mt-4">This should only take a moment...</p>
      </div>
    );
  }

  // If not authenticated, redirect to onboarding page
  if (!user) {
    // Show error toast for non-root paths, but only once per path
    if (location.pathname !== '/' && !hasShownMessage) {
      toast.error("Please complete onboarding to access this page", {
        duration: 4000
      });
      setHasShownMessage(true);
      return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
    }
    
    // For the root route, just navigate to onboarding without message
    return <Navigate to="/onboarding" replace />;
  }

  // If the user exists but hasn't completed onboarding and is not on the onboarding page
  if (user && !user.user_metadata?.is_onboarded && !location.pathname.includes('/onboarding')) {
    if (!hasShownMessage) {
      toast.info("Please complete your onboarding first", {
        description: "You're almost there!",
        duration: 4000
      });
      setHasShownMessage(true);
    }
    return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};

export default ProtectedLayout;
