
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { trackAnalyticEvent } from "@/services/analytics-service";
import { updateOnboardingStep, saveOnboardingData } from "@/services/user-settings-service";

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        setIsLoggedIn(true);
        
        if (profile) {
          setOnboardingData({
            username: profile.username,
            full_name: profile.full_name,
            bio: profile.bio,
            avatar: profile.avatar,
            is_activist: profile.is_activist,
            interests: profile.interests || [],
          });
          
          if (profile.is_onboarded) {
            navigate('/home');
            return;
          }
          
          if (currentStep < 4) {
            setCurrentStep(4);
            try {
              await updateOnboardingStep(user.id, 'account-creation');
            } catch (error) {
              console.error("Error updating onboarding step:", error);
            }
          }
        }
      }
      setLoading(false);
    };
    
    checkOnboardingStatus();
  }, [navigate, currentStep, user, profile]);

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      if (user) {
        trackAnalyticEvent(user.id, "onboarding_step_complete", { 
          resource_type: "onboarding", 
          step: currentStep, 
          next_step: nextStep 
        });
        
        try {
          const stepName = getStepName(nextStep);
          await updateOnboardingStep(user.id, stepName);
        } catch (error) {
          console.error("Error updating onboarding step:", error);
        }
      }
    }
  };

  const handleComplete = async () => {
    if (!user) {
      navigate("/home");
      return;
    }
    
    try {
      setLoading(true);
      await saveOnboardingData(user.id, {
        ...onboardingData,
        is_onboarded: true
      });
      
      trackAnalyticEvent(user.id, "onboarding_complete", { 
        resource_type: "onboarding" 
      });
      
      await refreshProfile();
      navigate("/home");
    } catch (error) {
      console.error("Error completing onboarding:", error);
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

const TOTAL_STEPS = 12;

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

