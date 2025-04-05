
import React, { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
  backgroundClass?: string;
}

const OnboardingLayout = ({ children, backgroundClass = "bg-purple-teal-gradient" }: OnboardingLayoutProps) => {
  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-6 ${backgroundClass}`}>
      <div className="relative w-full max-w-md">
        {/* Decorative background bubbles */}
        <div className="absolute -z-10 top-0 left-0 w-40 h-40 rounded-full bg-unmute-pink/30 blur-3xl" />
        <div className="absolute -z-10 bottom-0 right-0 w-60 h-60 rounded-full bg-unmute-teal/20 blur-3xl" />
        
        {/* Onboarding card */}
        <div className="unmute-card w-full min-h-[500px] flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
