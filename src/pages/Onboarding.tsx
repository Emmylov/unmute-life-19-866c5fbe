
import React, { useEffect } from "react";
import { useOnboarding } from "@/hooks/use-onboarding";
import OnboardingBackground from "@/components/onboarding/OnboardingBackground";
import OnboardingStepRenderer from "@/components/onboarding/OnboardingStepRenderer";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCurrentUser } from "@/services/auth-service";
import { useNavigate } from "react-router-dom";

const TOTAL_STEPS = 12;

const Onboarding = () => {
  const {
    currentStep,
    loading,
    handleNext,
    handleComplete
  } = useOnboarding();
  
  const navigate = useNavigate();
  
  // Check if the user is authenticated
  useEffect(() => {
    const checkAuthentication = async () => {
      const user = await getCurrentUser();
      
      // For steps 4 and above, we require authentication
      if (currentStep >= 4 && !user) {
        navigate('/auth', { state: { from: '/onboarding' } });
      }
    };
    
    if (!loading) {
      checkAuthentication();
    }
  }, [currentStep, loading, navigate]);
  
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
        onNext={handleNext}
        onComplete={handleComplete}
      />
      {currentStep < TOTAL_STEPS - 1 && (
        <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      )}
    </OnboardingBackground>
  );
};

export default Onboarding;
