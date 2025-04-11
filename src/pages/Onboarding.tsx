
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import AboutStep from "@/components/onboarding/AboutStep";
import HowItWorksStep from "@/components/onboarding/HowItWorksStep";
import SignUpPromptStep from "@/components/onboarding/SignUpPromptStep";
import AccountCreationStep from "@/components/onboarding/AccountCreationStep";
import InterestsStep from "@/components/onboarding/InterestsStep";
import ProfileSetupStep from "@/components/onboarding/ProfileSetupStep";
import FinalWelcomeStep from "@/components/onboarding/FinalWelcomeStep";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/services/analytics-service";
import { updateOnboardingStep, saveOnboardingData } from "@/services/user-settings-service";
import { useAuth } from "@/contexts/AuthContext";

const TOTAL_STEPS = 8;

const Onboarding = () => {
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
          
          // If the user is logged in but not onboarded, start from account creation step
          if (currentStep < 4) {
            setCurrentStep(4);
            
            // Update onboarding step in database
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
      
      // Track analytics event for step completion
      if (user) {
        trackEvent(user.id, {
          event_type: "onboarding_step_complete",
          resource_type: "onboarding",
          data: { step: currentStep, next_step: nextStep }
        });
        
        // Update onboarding step in database
        try {
          let stepName = "";
          switch (nextStep) {
            case 1: stepName = "about"; break;
            case 2: stepName = "how-it-works"; break;
            case 3: stepName = "signup-prompt"; break;
            case 4: stepName = "account-creation"; break;
            case 5: stepName = "interests"; break;
            case 6: stepName = "profile-setup"; break;
            case 7: stepName = "final-welcome"; break;
            default: stepName = "welcome"; break;
          }
          
          await updateOnboardingStep(user.id, stepName);
        } catch (error) {
          console.error("Error updating onboarding step:", error);
        }
      }
    }
  };
  
  const handleCreateAccount = () => {
    setCurrentStep(4);
  };
  
  const handleContinueAnyway = () => {
    navigate("/home");
  };
  
  const handleUpdateOnboardingData = (data: any) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };
  
  const handleComplete = async () => {
    if (!user) {
      navigate("/home");
      return;
    }
    
    try {
      setLoading(true);
      
      // Save all onboarding data
      await saveOnboardingData(user.id, {
        ...onboardingData,
        is_onboarded: true
      });
      
      // Track completion event
      trackEvent(user.id, {
        event_type: "onboarding_complete",
        resource_type: "onboarding"
      });
      
      // Refresh the user profile
      await refreshProfile();
      
      toast.success("Welcome to Unmute!", {
        description: "Your profile is now ready to use."
      });
      
      navigate("/home");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("There was an error completing your onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const getBackgroundClass = () => {
    switch (currentStep) {
      case 0:
        return "bg-gradient-to-br from-unmute-purple/20 to-unmute-teal/20";
      case 1:
        return "bg-gradient-to-br from-unmute-pink/20 to-unmute-purple/20";
      case 2:
        return "bg-gradient-to-br from-unmute-coral/20 to-unmute-pink/20";
      case 3:
        return "bg-gradient-to-br from-unmute-teal/20 to-unmute-coral/20";
      case 4:
        return "bg-white";
      case 5:
        return "bg-gradient-to-br from-blue-500/20 to-unmute-purple/20";
      case 6:
        return "bg-gradient-to-br from-unmute-purple/20 to-green-500/20";
      case 7:
        return "bg-gradient-to-br from-unmute-pink/20 to-unmute-purple/20";
      default:
        return "bg-gradient-to-br from-unmute-purple/20 to-unmute-teal/20";
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <AboutStep onNext={handleNext} />;
      case 2:
        return <HowItWorksStep onNext={handleNext} />;
      case 3:
        return (
          <SignUpPromptStep
            onCreateAccount={handleCreateAccount}
            onContinueAnyway={handleContinueAnyway}
          />
        );
      case 4:
        return (
          <AccountCreationStep 
            onNext={handleNext} 
            onUpdateData={handleUpdateOnboardingData}
            initialData={onboardingData}
          />
        );
      case 5:
        return (
          <InterestsStep 
            onNext={handleNext} 
            onUpdateData={handleUpdateOnboardingData}
            initialInterests={onboardingData.interests || []}
          />
        );
      case 6:
        return (
          <ProfileSetupStep 
            onNext={handleNext}
            onUpdateData={handleUpdateOnboardingData}
            initialData={onboardingData}
          />
        );
      case 7:
        return <FinalWelcomeStep onComplete={handleComplete} userData={onboardingData} />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-unmute-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <OnboardingLayout backgroundClass={getBackgroundClass()}>
      {renderStep()}
      {currentStep < TOTAL_STEPS - 1 && (
        <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      )}
    </OnboardingLayout>
  );
};

export default Onboarding;
