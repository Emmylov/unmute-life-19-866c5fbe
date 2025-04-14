
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UseAuthGuardProps {
  redirectTo?: string;
  message?: string;
}

export const useAuthGuard = ({
  redirectTo = "/auth",
  message = "Please log in to access this page"
}: UseAuthGuardProps = {}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after auth check is complete
    if (!loading && !user) {
      toast.error(message);
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo, message]);

  return { isAuthenticated: !!user, isLoading: loading };
};

export default useAuthGuard;
