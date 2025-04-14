
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UseAuthGuardProps {
  redirectTo?: string;
  message?: string;
  redirectIfAuthenticated?: boolean;
  authenticatedRedirectTo?: string;
}

/**
 * Hook to protect routes based on authentication status
 * 
 * @param redirectTo Path to redirect unauthenticated users to
 * @param message Toast message to show when redirecting
 * @param redirectIfAuthenticated Whether to redirect if user is authenticated
 * @param authenticatedRedirectTo Path to redirect authenticated users to
 * @returns Authentication state and loading status
 */
export const useAuthGuard = ({
  redirectTo = "/auth",
  message = "Please log in to access this page",
  redirectIfAuthenticated = false,
  authenticatedRedirectTo = "/home"
}: UseAuthGuardProps = {}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only take action after auth check is complete
    if (!loading) {
      // Case 1: User is not authenticated but needs to be
      if (!user && !redirectIfAuthenticated) {
        toast.error(message);
        navigate(redirectTo);
      }
      
      // Case 2: User is authenticated but shouldn't be (e.g., login page)
      if (user && redirectIfAuthenticated) {
        navigate(authenticatedRedirectTo);
      }
      
      setHasChecked(true);
    }
  }, [user, loading, navigate, redirectTo, redirectIfAuthenticated, authenticatedRedirectTo, message]);

  return { 
    isAuthenticated: !!user, 
    isLoading: loading || !hasChecked,
    user 
  };
};

export default useAuthGuard;
