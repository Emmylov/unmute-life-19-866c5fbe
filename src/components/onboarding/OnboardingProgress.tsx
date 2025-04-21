
import React from "react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.round(((currentStep + 1) / totalSteps) * 100);
  
  return (
    <div className="w-full px-6 py-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-xs font-medium text-gray-500">
          {progressPercentage}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-gradient-to-r from-unmute-purple to-unmute-teal h-1.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OnboardingProgress;
