
import React from "react";
import { useOnboarding } from "@/hooks/use-onboarding";
import OnboardingBackground from "@/components/onboarding/OnboardingBackground";
import OnboardingStepRenderer from "@/components/onboarding/OnboardingStepRenderer";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";

const TOTAL_STEPS = 12;

const Onboarding = () => {
  const {
    currentStep,
    loading,
    handleNext,
    handleComplete
  } = useOnboarding();
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-unmute-purple border-t-transparent rounded-full"></div>
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
