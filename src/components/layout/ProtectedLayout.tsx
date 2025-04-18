
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

const ProtectedLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // While checking authentication, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" color="primary" text="Verifying your access..." />
      </div>
    );
  }

  // If not authenticated, redirect to onboarding page (changed from /auth)
  if (!user) {
    // Show error toast for non-root paths
    if (location.pathname !== '/') {
      toast.error("Please complete onboarding to access this page");
      return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
    }
    
    // For the root route, just navigate to onboarding without message
    return <Navigate to="/onboarding" replace />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};

export default ProtectedLayout;
