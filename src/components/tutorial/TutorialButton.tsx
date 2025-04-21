
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useTutorial } from '@/contexts/TutorialContext';
import { useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// List of paths where the tutorial button should be hidden
const HIDDEN_PATHS = ['/', '/auth', '/onboarding'];

export const TutorialButton: React.FC = () => {
  const { startTutorial } = useTutorial();
  const location = useLocation();
  
  const currentPath = location.pathname.split('/')[1] || 'home';
  
  // Hide button on certain paths
  if (HIDDEN_PATHS.includes(location.pathname)) {
    return null;
  }
  
  const handleStartTutorial = (pageType: string) => {
    try {
      startTutorial(pageType);
    } catch (error) {
      console.error("Error starting tutorial:", error);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-unmute-purple/10"
          aria-label="Help and tutorials"
        >
          <HelpCircle className="h-5 w-5 text-unmute-purple" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-white z-50">
        <DropdownMenuItem 
          onClick={() => handleStartTutorial(currentPath)}
          className="cursor-pointer"
        >
          Tour this page
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStartTutorial('home')}
          className="cursor-pointer"
        >
          Home tutorial
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStartTutorial('explore')}
          className="cursor-pointer"
        >
          Explore tutorial
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStartTutorial('wellness')}
          className="cursor-pointer"
        >
          Wellness tutorial
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TutorialButton;
