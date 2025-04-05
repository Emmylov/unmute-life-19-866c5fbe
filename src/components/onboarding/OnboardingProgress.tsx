
import React from "react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index < currentStep ? "w-8 bg-unmute-purple" : "w-2 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default OnboardingProgress;
