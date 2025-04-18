
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

  // If not authenticated, redirect to login page with a message
  if (!user) {
    // Only show the toast if coming from a protected route (not initial load)
    if (location.pathname !== '/' && location.pathname !== '/onboarding') {
      toast.error("Please log in to access this page");
      return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }
    
    // Special case for onboarding - redirect to auth but don't show error
    if (location.pathname === '/onboarding') {
      return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }
    
    // For the root route, just navigate to auth without message
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};

export default ProtectedLayout;
