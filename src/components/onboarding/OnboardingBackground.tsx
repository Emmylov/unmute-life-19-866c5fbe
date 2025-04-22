
import React from "react";
import { useIsMobile } from "@/hooks/use-responsive";

interface OnboardingBackgroundProps {
  step: number;
  children: React.ReactNode;
}

const OnboardingLayout: React.FC<{
  children: React.ReactNode;
  backgroundClass?: string;
}> = ({ children, backgroundClass = "bg-purple-teal-gradient" }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-2 sm:p-6 ${backgroundClass}`}>
      <div className="relative w-full max-w-md">
        {/* Decorative background bubbles */}
        <div className="absolute -z-10 top-0 left-0 w-40 h-40 rounded-full bg-unmute-pink/30 blur-3xl" />
        <div className="absolute -z-10 bottom-0 right-0 w-60 h-60 rounded-full bg-unmute-teal/20 blur-3xl" />
        
        {/* Onboarding card */}
        <div className={`unmute-card w-full ${isMobile ? 'min-h-[85vh]' : 'min-h-[500px]'} flex flex-col overflow-y-auto`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const OnboardingBackground: React.FC<OnboardingBackgroundProps> = ({ step, children }) => {
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
