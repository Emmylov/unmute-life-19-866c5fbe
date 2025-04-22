
import React, { useEffect, useState } from "react";
import { useOnboarding } from "@/hooks/use-onboarding";
import OnboardingBackground from "@/components/onboarding/OnboardingBackground";
import OnboardingStepRenderer from "@/components/onboarding/OnboardingStepRenderer";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCurrentUser } from "@/services/auth-service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const TOTAL_STEPS = 12;

const Onboarding = () => {
  const {
    currentStep,
    loading,
    handleNext,
    handleComplete,
    checkComplete
  } = useOnboarding();
  
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loadingCheck, setLoadingCheck] = useState(true);
  const [checkError, setCheckError] = useState<string | null>(null);
  
  // Check if the user is already fully onboarded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        setLoadingCheck(true);
        setCheckError(null);
        
        // Check user metadata first
        if (user?.user_metadata?.is_onboarded) {
          console.log("User already onboarded (user metadata). Redirecting to home.");
          navigate('/home');
          return;
        }
        
        // Then check profile data which is more reliable
        if (profile?.is_onboarded) {
          console.log("User already onboarded (profile data). Redirecting to home.");
          navigate('/home');
          return;
        }
        
        // As a fallback, check if other profile data exists that would indicate completed onboarding
        if (profile && (profile.username || profile.full_name || profile.bio)) {
          console.log("User has profile data. Likely already onboarded. Redirecting to home.");
          navigate('/home');
          return;
        }
        
        // Double check with direct auth service as last resort
        try {
          const currentUser = await getCurrentUser();
          if (currentUser?.user_metadata?.is_onboarded) {
            console.log("User already onboarded (direct check). Redirecting to home.");
            navigate('/home');
            return;
          }
        } catch (error) {
          console.error("Error with direct auth check:", error);
          // Continue onboarding if this check fails, don't block the flow
        }
        
        setLoadingCheck(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setCheckError("Failed to check onboarding status");
        setLoadingCheck(false);
        toast.error("Error checking onboarding status");
      }
    };
    
    if (!loading && checkComplete) {
      checkOnboardingStatus();
    } else if (!loading && !checkComplete) {
      // If hook has finished loading but check isn't complete, start our check
      setLoadingCheck(false);
    }
  }, [user, profile, loading, navigate, checkComplete]);

  const handleRetry = () => {
    window.location.reload();
  };

  // Define a safe wrapper for handleNext to ensure it works properly
  const safeHandleNext = () => {
    try {
      handleNext();
    } catch (error) {
      console.error("Error advancing to next step:", error);
      toast.error("Error advancing to next step. Please try again.");
    }
  };

  // Define a safe wrapper for handleComplete
  const safeHandleComplete = () => {
    try {
      handleComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Error completing onboarding. Please try again.");
    }
  };
  
  // Show loading UI if we're loading either from the hook or our extra check
  if (loading || loadingCheck) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="large" color="purple" text="Loading onboarding..." />
        <p className="text-gray-500 mt-2 text-sm">This should only take a moment...</p>
      </div>
    );
  }
  
  if (checkError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6 text-center">{checkError}</p>
        <Button onClick={handleRetry} className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }
  
  return (
    <OnboardingBackground step={currentStep}>
      <OnboardingStepRenderer
        currentStep={currentStep}
        onNext={safeHandleNext}
        onComplete={safeHandleComplete}
      />
      {currentStep < TOTAL_STEPS - 1 && (
        <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      )}
    </OnboardingBackground>
  );
};

export default Onboarding;
