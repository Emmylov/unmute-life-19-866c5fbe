
import React from "react";

interface OnboardingBackgroundProps {
  step: number;
  children: React.ReactNode;
}

export const OnboardingBackground: React.FC<OnboardingBackgroundProps> = ({ step, children }) => {
  const getBackgroundClass = () => {
    switch (step) {
      case 0:
        return "bg-gradient-to-br from-unmute-purple/20 to-unmute-teal/20";
      case 1:
        return "bg-gradient-to-br from-unmute-pink/20 to-unmute-purple/20";
      case 2:
        return "bg-gradient-to-br from-unmute-coral/20 to-unmute-pink/20";
      case 3:
        return "bg-gradient-to-br from-unmute-teal/20 to-unmute-coral/20";
      case 4:
        return "bg-white";
      case 5:
        return "bg-gradient-to-br from-blue-500/20 to-unmute-purple/20";
      case 6:
        return "bg-gradient-to-br from-unmute-purple/20 to-green-500/20";
      case 7:
        return "bg-gradient-to-br from-unmute-pink/20 to-unmute-purple/20";
      default:
        return "bg-gradient-to-br from-unmute-purple/20 to-unmute-teal/20";
    }
  };

  return (
    <OnboardingLayout backgroundClass={getBackgroundClass()}>
      {children}
    </OnboardingLayout>
  );
};

export default OnboardingBackground;
