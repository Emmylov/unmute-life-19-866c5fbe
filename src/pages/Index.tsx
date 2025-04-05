
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const startOnboarding = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-unmute-purple/30 to-unmute-pink/30 p-6">
      {/* Logo and name */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <span className="unmute-gradient-text">Unmute</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-700">
          Your voice, amplified.
        </p>
      </div>

      {/* Decorative elements */}
      <div className="relative w-full max-w-md h-64 mb-12">
        {/* Background bubbles */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-unmute-purple/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/3 w-32 h-32 bg-unmute-pink/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-3/4 -translate-y-2/3 w-24 h-24 bg-unmute-coral/20 rounded-full blur-xl" />
        
        {/* Sound wave animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-end space-x-2 h-20">
          {[3, 5, 8, 12, 16, 20, 16, 12, 8, 5, 3].map((height, index) => (
            <div 
              key={index}
              className="w-2 bg-gradient-to-t from-unmute-purple to-unmute-pink rounded-full animate-wave"
              style={{ 
                height: `${height * 4}px`, 
                animationDelay: `${index * 0.1}s` 
              }}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button 
          onClick={startOnboarding} 
          className="unmute-primary-button text-lg"
        >
          Get Started
        </Button>
        
        <p className="mt-4 text-sm text-gray-600">
          Join thousands of teens making their voices heard
        </p>
      </div>
    </div>
  );
};

export default Index;
