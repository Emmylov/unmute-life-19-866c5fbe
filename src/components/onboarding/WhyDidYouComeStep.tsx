
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface WhyDidYouComeStepProps {
  onNext: () => void;
}

const reasons = [
  "I want to feel more heard",
  "I'm tired of fake platforms",
  "I want to talk about my health",
  "I want to connect without judgment",
  "I'm hurting but I'm healing",
  "I just want a safe place to be myself",
  "I'm not sure yet, but I'm curious",
];

const WhyDidYouComeStep = ({ onNext }: WhyDidYouComeStepProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2">Why Did You Come?</h2>
      <p className="text-gray-600 mb-8 text-center">Choose what brought you here</p>

      <div className="grid gap-3 w-full max-w-md mb-8">
        {reasons.map((reason) => (
          <button
            key={reason}
            onClick={() => toggleReason(reason)}
            className={`unmute-bubble p-4 text-left flex items-center justify-between ${
              selectedReasons.includes(reason)
                ? "bg-gradient-to-r from-unmute-purple to-unmute-pink text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <span>{reason}</span>
            {selectedReasons.includes(reason) && (
              <Check className="h-5 w-5 ml-2" />
            )}
          </button>
        ))}
      </div>

      <Button
        onClick={onNext}
        className="unmute-primary-button"
        disabled={selectedReasons.length === 0}
      >
        Next
      </Button>
    </div>
  );
};

export default WhyDidYouComeStep;
