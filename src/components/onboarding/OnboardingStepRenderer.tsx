
import React from "react";
import WelcomeStep from "./WelcomeStep";
import WhyDidYouComeStep from "./WhyDidYouComeStep";
import MoodCheckStep from "./MoodCheckStep";
import ExpressionStyleStep from "./ExpressionStyleStep";
import CategorizedInterestsStep from "./CategorizedInterestsStep";
import RecommendedCommunitiesStep from "./RecommendedCommunitiesStep";
import WellnessSetupStep from "./WellnessSetupStep";
import UnmuteRitualStep from "./UnmuteRitualStep";
import ProfileSetupStep from "./ProfileSetupStep";
import FirstUnmuteStep from "./FirstUnmuteStep";
import WelcomeFeedStep from "./WelcomeFeedStep";
import CustomizeExperienceStep from "./CustomizeExperienceStep";
import FinalWelcomeStep from "./FinalWelcomeStep";

interface OnboardingStepRendererProps {
  currentStep: number;
  onNext: () => void;
  onComplete: () => void;
}

export const OnboardingStepRenderer: React.FC<OnboardingStepRendererProps> = ({
  currentStep,
  onNext,
  onComplete,
}) => {
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
      return <CategorizedInterestsStep onNext={onNext} />;
    case 5:
      return <RecommendedCommunitiesStep onNext={onNext} />;
    case 6:
      return <WellnessSetupStep onNext={onNext} />;
    case 7:
      return <UnmuteRitualStep onNext={onNext} />;
    case 8:
      return <ProfileSetupStep onNext={onNext} />;
    case 9:
      return <FirstUnmuteStep onNext={onNext} />;
    case 10:
      return <WelcomeFeedStep onNext={onNext} />;
    case 11:
      return <CustomizeExperienceStep onNext={onNext} />;
    case 12:
      return <FinalWelcomeStep onComplete={onComplete} />;
    default:
      return null;
  }
};

export default OnboardingStepRenderer;
