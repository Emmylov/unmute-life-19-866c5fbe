
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { trackAnalyticEvent } from "@/services/analytics-service";
import { updateOnboardingStep, saveOnboardingData } from "@/services/user-settings-service";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/auth-service";

const TOTAL_STEPS = 12;

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Check authentication directly with supabase
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setIsLoggedIn(true);
        
        // Refresh the profile to make sure we have the latest data
        await refreshProfile();
        
        if (profile) {
          setOnboardingData({
            username: profile.username,
            full_name: profile.full_name,
            bio: profile.bio,
            avatar: profile.avatar,
            is_activist: profile.is_activist,
            interests: profile.interests || [],
            theme_color: profile.theme_color,
          });
          
          if (profile.is_onboarded) {
            navigate('/home');
            return;
          }
          
          if (profile.onboarding_step === 'account-creation' && currentStep < 4) {
            setCurrentStep(4);
          }
        }
        
        // If we're still at step 0 but user exists, move to step 4 (account creation is done)
        if (currentStep === 0 && !profile?.onboarding_step) {
          setCurrentStep(4);
        }
      } else if (currentStep >= 4) {
        // If we're past account creation step but no user, go back to step 0
        setCurrentStep(0);
      }
      
      setLoading(false);
    };
    
    checkOnboardingStatus();
  }, [navigate, currentStep, user, profile, refreshProfile]);

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Refresh user to make sure we have the latest data
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
        }
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
      navigate("/auth");
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
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    loading,
    isLoggedIn,
    onboardingData,
    handleNext,
    handleComplete,
    setOnboardingData: (data: any) => setOnboardingData(prev => ({ ...prev, ...data }))
  };
};

const getStepName = (step: number): string => {
  switch (step) {
    case 1: return "about";
    case 2: return "how-it-works";
    case 3: return "signup-prompt";
    case 4: return "account-creation";
    case 5: return "interests";
    case 6: return "profile-setup";
    case 7: return "final-welcome";
    default: return "welcome";
  }
};
