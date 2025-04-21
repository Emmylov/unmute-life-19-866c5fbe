
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

const ProtectedLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [hasShownMessage, setHasShownMessage] = useState(false);
  
  useEffect(() => {
    // Reset the flag when location changes
    return () => setHasShownMessage(false);
  }, [location.pathname]);
  
  // While checking authentication, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" color="primary" text="Verifying your access..." />
      </div>
    );
  }

  // If not authenticated, redirect to onboarding page
  if (!user) {
    // Show error toast for non-root paths, but only once per path
    if (location.pathname !== '/' && !hasShownMessage) {
      toast.error("Please complete onboarding to access this page");
      setHasShownMessage(true);
      return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
    }
    
    // For the root route, just navigate to onboarding without message
    return <Navigate to="/onboarding" replace />;
  }

  // If the user exists but hasn't completed onboarding and is not on the onboarding page
  if (user && !user.user_metadata?.is_onboarded && !location.pathname.includes('/onboarding')) {
    if (!hasShownMessage) {
      toast.info("Please complete your onboarding first");
      setHasShownMessage(true);
    }
    return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};

export default ProtectedLayout;
