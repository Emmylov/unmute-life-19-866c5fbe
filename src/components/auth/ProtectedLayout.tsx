
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedLayoutProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * A layout component that protects routes requiring authentication
 * Shows consistent loading spinner and handles redirects
 */
const ProtectedLayout = ({ 
  children, 
  redirectTo = "/auth" 
}: ProtectedLayoutProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking authentication, show a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" color="purple" text="Loading..." />
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!user) {
    // Save the page they were trying to access
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedLayout;
