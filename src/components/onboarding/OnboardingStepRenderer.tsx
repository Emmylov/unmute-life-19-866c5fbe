import React from "react";
import WelcomeStep from "./WelcomeStep";
import WhyDidYouComeStep from "./WhyDidYouComeStep";
import MoodCheckStep from "./MoodCheckStep";
import ExpressionStyleStep from "./ExpressionStyleStep";
import AccountCreationStep from "./AccountCreationStep";
import InterestsStep from "./InterestsStep";
import RecommendedCommunitiesStep from "./RecommendedCommunitiesStep";
import WellnessSetupStep from "./WellnessSetupStep";
import UnmuteRitualStep from "./UnmuteRitualStep";
import ProfileSetupStep from "./ProfileSetupStep";
import FirstUnmuteStep from "./FirstUnmuteStep";
import WelcomeFeedStep from "./WelcomeFeedStep";
import FinalWelcomeStep from "./FinalWelcomeStep";

interface OnboardingStepRendererProps {
  currentStep: number;
  onNext: () => void;
  onComplete: () => void;
}

const OnboardingStepRenderer: React.FC<OnboardingStepRendererProps> = ({
  currentStep,
  onNext,
  onComplete
}) => {
  // Return the appropriate component based on the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={onNext} />;
      case 1:
        return <WhyDidYouComeStep onNext={onNext} />;
      case 2:
        return <MoodCheckStep onNext={onNext} />;
      case 3:
        return <ExpressionStyleStep onNext={onNext} />;
      case 4:
        return <AccountCreationStep onNext={onNext} />;
      case 5:
        return <InterestsStep onNext={onNext} />;
      case 6:
        return <RecommendedCommunitiesStep onNext={onNext} />;
      case 7:
        return <WellnessSetupStep onNext={onNext} />;
      case 8:
        return <UnmuteRitualStep onNext={onNext} />;
      case 9:
        return <ProfileSetupStep onNext={onNext} />;
      case 10:
        return <FirstUnmuteStep onNext={onNext} />;
      case 11:
        return <WelcomeFeedStep onNext={onNext} />;
      case 12:
        return <FinalWelcomeStep onComplete={onComplete} />;
      default:
        return <WelcomeStep onNext={onNext} />;
    }
  };
  
  return (
    <>
      {renderStep()}
    </>
  );
};

export default OnboardingStepRenderer;
