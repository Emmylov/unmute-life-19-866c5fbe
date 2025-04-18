
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type TutorialStep = {
  id: string;
  title: string;
  content: string;
  element?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
};

type TutorialContextType = {
  isTutorialActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  startTutorial: (tutorialId: string) => void;
  endTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  tutorialSeen: Record<string, boolean>;
  markTutorialSeen: (tutorialId: string) => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const tutorials: Record<string, TutorialStep[]> = {
  'home': [
    {
      id: 'welcome',
      title: 'Welcome to Unmute!',
      content: 'This is your personal dashboard where you can see content from users you follow.',
      element: '[data-tutorial="home-feed"]',
      position: 'bottom',
    },
    {
      id: 'sidebar',
      title: 'Navigation',
      content: 'Use the sidebar to navigate to different sections of the app.',
      element: '[data-tutorial="sidebar"]',
      position: 'right',
    },
    {
      id: 'create-post',
      title: 'Express Yourself',
      content: 'Create posts, share thoughts, and connect with others.',
      element: '[data-tutorial="create-post"]',
      position: 'bottom',
    }
  ],
  'explore': [
    {
      id: 'explore-intro',
      title: 'Discover Content',
      content: 'Discover new content, communities, and users to follow.',
      position: 'top',
    },
    {
      id: 'trending',
      title: 'Trending Topics',
      content: 'See what topics are popular right now.',
      element: '[data-tutorial="trending"]',
      position: 'bottom',
    }
  ],
  'wellness': [
    {
      id: 'wellness-intro',
      title: 'Your Wellness Hub',
      content: 'Access resources, tools, and support for your mental health.',
      position: 'top',
    },
    {
      id: 'daily-check',
      title: 'Daily Check-in',
      content: 'Track your mood and mental wellbeing daily.',
      element: '[data-tutorial="daily-check"]',
      position: 'bottom',
    }
  ]
};

// List of paths where tutorials should be disabled
const TUTORIAL_DISABLED_PATHS = ['/', '/auth', '/onboarding'];

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentTutorialId, setCurrentTutorialId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TutorialStep[]>([]);
  const [tutorialSeen, setTutorialSeen] = useState<Record<string, boolean>>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('tutorials-seen');
    return saved ? JSON.parse(saved) : {};
  });
  
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Disable tutorial on certain paths
  useEffect(() => {
    if (TUTORIAL_DISABLED_PATHS.includes(currentPath) && isTutorialActive) {
      setIsTutorialActive(false);
    }
  }, [currentPath, isTutorialActive]);
  
  // Check if we should show tutorial when route changes
  useEffect(() => {
    if (!isTutorialActive) {
      const path = location.pathname.split('/')[1] || 'home';
      
      // Don't show tutorials on disabled paths
      if (TUTORIAL_DISABLED_PATHS.includes(currentPath)) {
        return;
      }
      
      if (tutorials[path] && !tutorialSeen[path]) {
        setTimeout(() => {
          startTutorial(path);
        }, 1000); // Delay to allow page to fully render
      }
    }
  }, [location, isTutorialActive, currentPath, tutorialSeen]);
  
  // Save tutorial seen status to localStorage
  useEffect(() => {
    localStorage.setItem('tutorials-seen', JSON.stringify(tutorialSeen));
  }, [tutorialSeen]);
  
  const startTutorial = (tutorialId: string) => {
    // Don't start tutorials on disabled paths
    if (TUTORIAL_DISABLED_PATHS.includes(currentPath)) {
      return;
    }
    
    if (tutorials[tutorialId]) {
      setCurrentTutorialId(tutorialId);
      setSteps(tutorials[tutorialId]);
      setCurrentStep(0);
      setIsTutorialActive(true);
    }
  };
  
  const endTutorial = () => {
    if (currentTutorialId) {
      markTutorialSeen(currentTutorialId);
    }
    setIsTutorialActive(false);
    setCurrentStep(0);
  };
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      endTutorial();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  const skipTutorial = () => {
    endTutorial();
  };
  
  const markTutorialSeen = (tutorialId: string) => {
    setTutorialSeen(prev => ({
      ...prev,
      [tutorialId]: true
    }));
  };
  
  const value = {
    isTutorialActive,
    currentStep,
    steps,
    startTutorial,
    endTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    tutorialSeen,
    markTutorialSeen
  };
  
  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
