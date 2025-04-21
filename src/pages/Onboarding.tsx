
import React, { useEffect } from "react";
import { useOnboarding } from "@/hooks/use-onboarding";
import OnboardingBackground from "@/components/onboarding/OnboardingBackground";
import OnboardingStepRenderer from "@/components/onboarding/OnboardingStepRenderer";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCurrentUser } from "@/services/auth-service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const TOTAL_STEPS = 12;

const Onboarding = () => {
  const {
    currentStep,
    loading,
    handleNext,
    handleComplete
  } = useOnboarding();
  
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  // Check if the user is already fully onboarded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
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
        const currentUser = await getCurrentUser();
        if (currentUser?.user_metadata?.is_onboarded) {
          console.log("User already onboarded (direct check). Redirecting to home.");
          navigate('/home');
          return;
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        toast.error("Error checking onboarding status");
      }
    };
    
    if (!loading) {
      checkOnboardingStatus();
    }
  }, [user, profile, loading, navigate]);

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
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="large" color="purple" text="Loading onboarding..." />
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
