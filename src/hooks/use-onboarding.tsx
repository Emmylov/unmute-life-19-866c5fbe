
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { trackAnalyticEvent } from "@/services/analytics-service";
import { updateOnboardingStep, saveOnboardingData } from "@/services/user-settings-service";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/auth-service";

const TOTAL_STEPS = 13;

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start at welcome step
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  
  useEffect(() => {
    let isMounted = true;
    
    const checkOnboardingStatus = async () => {
      try {
        setLoadingError(null);
        // Check authentication directly with supabase
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          if (isMounted) setIsLoggedIn(true);
          
          // Refresh the profile to make sure we have the latest data
          await refreshProfile();
          
          if (profile) {
            // Populate onboarding data from profile if available
            if (isMounted) {
              setOnboardingData({
                username: profile.username || '',
                full_name: profile.full_name || '',
                bio: profile.bio || '',
                avatar: profile.avatar || '',
                is_activist: profile.is_activist || false,
                interests: profile.interests || [],
                theme_color: profile.theme_color || '',
              });
            }
            
            if (profile.is_onboarded) {
              // If fully onboarded, go to home
              navigate('/home');
              return;
            }
            
            // For ongoing onboarding, always start at the beginning for now
            if (isMounted) setCurrentStep(0);
          }
        }
        
        if (isMounted) setLoading(false);
      } catch (error: any) {
        console.error("Error checking onboarding status:", error);
        if (isMounted) {
          setLoading(false);
          setLoadingError(error.message || "Failed to check onboarding status");
          setErrors(prev => [...prev, "Failed to check onboarding status"]);
          
          // Show toast for error
          toast.error("Error checking onboarding status", {
            description: "Please try refreshing the page"
          });
        }
      }
    };
    
    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
        setLoadingError("Loading timed out. Please refresh the page.");
        toast.error("Loading is taking too long", {
          description: "Please try refreshing the page"
        });
      }
    }, 10000);
    
    checkOnboardingStatus();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate, user, profile, refreshProfile]);

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Track analytics event if user is logged in
      try {
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          trackAnalyticEvent(currentUser.id, "onboarding_step_complete", { 
            resource_type: "onboarding", 
            step: currentStep, 
            next_step: nextStep 
          });
          
          try {
            const stepName = getStepName(nextStep);
            await updateOnboardingStep(currentUser.id, stepName);
          } catch (error) {
            console.error("Error updating onboarding step:", error);
            setErrors(prev => [...prev, "Failed to update onboarding step"]);
          }
        }
      } catch (error) {
        console.error("Error during next step:", error);
        // Don't block the user from continuing even if analytics fails
      }
    }
  };

  const handleComplete = async () => {
    // Double check authentication
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      toast.error("No user logged in", {
        description: "Please sign in to complete onboarding."
      });
      setCurrentStep(4); // Go to account creation step
      return;
    }
    
    try {
      setLoading(true);
      
      // Show a toast to indicate we're processing
      toast.loading("Completing your onboarding...", { id: "onboarding-complete" });
      
      await saveOnboardingData(currentUser.id, {
        ...onboardingData,
        is_onboarded: true
      });
      
      trackAnalyticEvent(currentUser.id, "onboarding_complete", { 
        resource_type: "onboarding" 
      });
      
      await refreshProfile();
      
      // Show success toast
      toast.success("Onboarding completed!", { 
        id: "onboarding-complete",
        description: "Welcome to Unmute! Your profile is ready." 
      });
      
      // Add a small delay before navigating to make sure the user sees the success message
      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Something went wrong", { 
        id: "onboarding-complete",
        description: "Please try again or contact support."
      });
      setErrors(prev => [...prev, "Failed to complete onboarding"]);
    } finally {
      setLoading(false);
    }
  };

  // Allow resetting errors
  const resetErrors = () => {
    setErrors([]);
    setLoadingError(null);
  };

  return {
    currentStep,
    loading,
    isLoggedIn,
    onboardingData,
    errors,
    loadingError,
    handleNext,
    handleComplete,
    resetErrors,
    setOnboardingData: (data: any) => setOnboardingData(prev => ({ ...prev, ...data }))
  };
};

// Helper function to get step index by name
const getStepIndexByName = (stepName: string): number => {
  switch (stepName) {
    case "welcome": return 0;
    case "why-did-you-come": return 1;
    case "mood-check": return 2;
    case "expression-style": return 3;
    case "account-creation": return 4;
    case "interests": return 5;
    case "communities": return 6;
    case "wellness-setup": return 7;
    case "unmute-ritual": return 8;
    case "profile-setup": return 9;
    case "first-unmute": return 10;
    case "welcome-feed": return 11;
    case "final-welcome": return 12;
    default: return 0;
  }
};

const getStepName = (step: number): string => {
  switch (step) {
    case 0: return "welcome";
    case 1: return "why-did-you-come";
    case 2: return "mood-check";
    case 3: return "expression-style";
    case 4: return "account-creation";
    case 5: return "interests";
    case 6: return "communities";
    case 7: return "wellness-setup";
    case 8: return "unmute-ritual";
    case 9: return "profile-setup";
    case 10: return "first-unmute";
    case 11: return "welcome-feed";
    case 12: return "final-welcome";
    default: return "welcome";
  }
};
