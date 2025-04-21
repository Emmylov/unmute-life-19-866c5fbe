
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

// Define the tutorial step structure
interface TutorialStep {
  element: string;
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

// Define the tutorial context type
interface TutorialContextType {
  isTutorialActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  startTutorial: (type?: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
}

// Create the context with a default value
const TutorialContext = createContext<TutorialContextType>({
  isTutorialActive: false,
  currentStep: 0,
  steps: [],
  startTutorial: () => {},
  nextStep: () => {},
  prevStep: () => {},
  skipTutorial: () => {},
});

// Define tutorial steps for different pages
const tutorialSteps: Record<string, TutorialStep[]> = {
  home: [
    {
      element: '.home-greeting',
      title: 'Welcome to Unmute!',
      content: 'This is your personalized feed where you can see posts from people you follow.',
      position: 'bottom',
    },
    {
      element: '.create-post',
      title: 'Share Your Voice',
      content: 'Click here to create a new post and share your thoughts with the community.',
      position: 'bottom',
    },
    {
      element: '.mood-selector',
      title: 'How Are You Feeling?',
      content: 'You can set your mood to let others know how you\'re doing today.',
      position: 'bottom',
    },
  ],
  explore: [
    {
      element: '.explore-search',
      title: 'Discover Content',
      content: 'Search for topics, people, or communities you\'re interested in.',
      position: 'bottom',
    },
    {
      element: '.trending-topics',
      title: 'Trending Topics',
      content: 'See what\'s popular in the Unmute community right now.',
      position: 'right',
    },
  ],
  wellness: [
    {
      element: '.wellness-banner',
      title: 'Your Wellness Hub',
      content: 'This is your personalized wellness space for mental health resources.',
      position: 'bottom',
    },
    {
      element: '.daily-dose',
      title: 'Daily Dose',
      content: 'Get a daily dose of positivity and wellness tips.',
      position: 'right',
    },
  ],
  onboarding: [
    {
      element: '', // No specific element for general intro
      title: 'Welcome to Onboarding',
      content: 'Let\'s get you set up with Unmute! We\'ll guide you through a few simple steps.',
      position: 'bottom',
    },
    {
      element: '.onboarding-card',
      title: 'Complete Your Profile',
      content: 'Tell us about yourself so we can personalize your experience.',
      position: 'bottom',
    },
  ],
};

// Tutorial Provider component
export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TutorialStep[]>([]);

  const startTutorial = useCallback((type = 'home') => {
    // Check if we have tutorial steps for this type
    if (!tutorialSteps[type]) {
      console.warn(`No tutorial steps found for "${type}"`);
      toast.info('Tutorial not available for this page yet');
      return;
    }
    
    setSteps(tutorialSteps[type]);
    setCurrentStep(0);
    setIsTutorialActive(true);
    
    // Add a class to the body for potential tutorial styling
    document.body.classList.add('tutorial-active');
    
    toast.success('Tutorial started', {
      description: 'Follow along to learn about this page'
    });
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // End tutorial if we're at the last step
      setIsTutorialActive(false);
      document.body.classList.remove('tutorial-active');
      toast.success('Tutorial completed!');
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipTutorial = useCallback(() => {
    setIsTutorialActive(false);
    document.body.classList.remove('tutorial-active');
    toast('Tutorial skipped', { description: 'You can restart it anytime' });
  }, []);

  return (
    <TutorialContext.Provider
      value={{
        isTutorialActive,
        currentStep,
        steps,
        startTutorial,
        nextStep,
        prevStep,
        skipTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

// Custom hook to use the tutorial context
export const useTutorial = () => useContext(TutorialContext);
