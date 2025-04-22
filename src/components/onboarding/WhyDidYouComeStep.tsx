
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface WhyDidYouComeStepProps {
  onNext: () => void;
}

const WhyDidYouComeStep: React.FC<WhyDidYouComeStepProps> = ({ onNext }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const reasons = [
    { id: "express", label: "To express myself" },
    { id: "connect", label: "To connect with others" },
    { id: "find-community", label: "To find my community" },
    { id: "share", label: "To share my story" },
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Why did you come to Unmute?</h2>
      <p className="text-gray-600 mb-8 text-center">
        Your answer helps us personalize your experience
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mb-8">
        {reasons.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSelectedReason(id)}
            className={`unmute-bubble py-4 px-5 flex items-center justify-center ${
              selectedReason === id
                ? "bg-gradient-to-r from-unmute-purple to-unmute-pink text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <span className="text-center">{label}</span>
          </button>
        ))}
      </div>

      <Button 
        onClick={onNext} 
        className="unmute-primary-button"
        disabled={!selectedReason}
      >
        Next
      </Button>
    </div>
  );
};

export default WhyDidYouComeStep;
