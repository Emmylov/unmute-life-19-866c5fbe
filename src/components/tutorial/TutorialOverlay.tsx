
import React, { useEffect, useState, useRef } from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TutorialOverlay: React.FC = () => {
  const { 
    isTutorialActive, 
    currentStep, 
    steps, 
    nextStep, 
    prevStep, 
    skipTutorial 
  } = useTutorial();
  
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isTutorialActive || steps.length === 0) return;
    
    const currentStepData = steps[currentStep];
    if (!currentStepData.element) {
      // Center in screen if no element specified
      setPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 150,
        width: 300,
        height: 200
      });
      return;
    }
    
    try {
      const element = document.querySelector(currentStepData.element);
      if (!element) {
        console.warn(`Tutorial element not found: ${currentStepData.element}`);
        // Use fallback positioning if element not found
        setPosition({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 150,
          width: 300,
          height: 200
        });
        return;
      }
      
      const rect = element.getBoundingClientRect();
      
      // Add a small buffer around the element
      const buffer = 10;
      setPosition({
        top: rect.top - buffer,
        left: rect.left - buffer,
        width: rect.width + buffer * 2,
        height: rect.height + buffer * 2
      });
      
      // Scroll element into view if needed
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      console.error("Error positioning tutorial overlay:", error);
      // Fallback positioning
      setPosition({
        top: 100,
        left: window.innerWidth / 2 - 150,
        width: 300,
        height: 200
      });
    }
  }, [isTutorialActive, currentStep, steps]);
  
  // Don't render anything if tutorial is not active
  if (!isTutorialActive || steps.length === 0) {
    return null;
  }
  
  const currentStepData = steps[currentStep];
  
  // Determine tooltip position based on element and specified position
  const tooltipPosition = () => {
    if (!currentStepData.element) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    
    const pos = currentStepData.position || 'bottom';
    
    switch (pos) {
      case 'top':
        return { 
          bottom: `${window.innerHeight - position.top + 10}px`, 
          left: `${position.left + position.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'right':
        return { 
          left: `${position.left + position.width + 10}px`, 
          top: `${position.top + position.height / 2}px`,
          transform: 'translateY(-50%)'
        };
      case 'bottom':
        return { 
          top: `${position.top + position.height + 10}px`, 
          left: `${position.left + position.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return { 
          right: `${window.innerWidth - position.left + 10}px`, 
          top: `${position.top + position.height / 2}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return { 
          top: `${position.top + position.height + 10}px`, 
          left: `${position.left + position.width / 2}px`,
          transform: 'translateX(-50%)'
        };
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-[1000] bg-black bg-opacity-50 pointer-events-auto"
      onClick={(e) => {
        // Only close if clicking outside the tooltip and highlighted area
        if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
          skipTutorial();
        }
      }}
    >
      {/* Highlight area with no overlay */}
      {currentStepData.element && (
        <div 
          className="absolute border-2 border-unmute-purple rounded-md"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        ></div>
      )}
      
      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          ref={overlayRef}
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute bg-white rounded-lg shadow-lg p-4 w-80 z-[1001]"
          style={tooltipPosition()}
        >
          <div className="flex items-center gap-2 mb-2 text-unmute-purple">
            <HelpCircle className="h-5 w-5" />
            <h3 className="font-medium text-lg">{currentStepData.title}</h3>
          </div>
          
          <p className="text-gray-600 mb-4">{currentStepData.content}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={skipTutorial}
                className="text-gray-500"
              >
                Skip
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={prevStep}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              
              <Button 
                variant="default" 
                size="sm" 
                onClick={nextStep}
                className="bg-unmute-purple hover:bg-unmute-purple/90"
              >
                {currentStep < steps.length - 1 ? (
                  <>Next <ChevronRight className="h-4 w-4 ml-1" /></>
                ) : (
                  'Finish'
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-2 flex justify-center">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1.5 w-1.5 rounded-full ${
                    index === currentStep ? 'bg-unmute-purple' : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TutorialOverlay;
