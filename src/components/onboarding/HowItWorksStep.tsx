
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface HowItWorksStepProps {
  onNext: () => void;
}

const features = [
  {
    title: "Post stories",
    description: "Share your moments with photos and text"
  },
  {
    title: "Join real convos",
    description: "Connect with others in meaningful discussions"
  },
  {
    title: "Create reels",
    description: "Express yourself through short videos"
  },
  {
    title: "Build your voice",
    description: "Make an impact on topics you care about"
  }
];

const HowItWorksStep = ({ onNext }: HowItWorksStepProps) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  // Auto-rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-6">
      <h2 className="text-3xl font-bold mb-6">How It Works</h2>
      
      <p className="text-lg text-gray-600 mb-8">
        Post stories, join real convos, create reels, and build your voice.
      </p>
      
      <div className="relative h-40 w-full mb-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center transition-all duration-500 ${
              index === currentFeature
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
          >
            <h3 className="text-2xl font-bold mb-2 unmute-gradient-text">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2 mb-8">
        {features.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentFeature ? "w-8 bg-unmute-purple" : "bg-gray-200"
            }`}
            onClick={() => setCurrentFeature(index)}
          />
        ))}
      </div>
      
      <Button 
        onClick={onNext} 
        className="unmute-primary-button"
      >
        Next
      </Button>
    </div>
  );
};

export default HowItWorksStep;
