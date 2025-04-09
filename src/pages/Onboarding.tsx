import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";

const TOTAL_STEPS = 8;

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          
          if (error.code === 'PGRST116') {
            await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                username: session.user.email,
                is_onboarded: false
              });
          }
        } else {
          setProfileData(profile);
          
          if (profile?.is_onboarded) {
            navigate('/home');
            return;
          }
        }
        
        if (currentStep < 4) {
          setCurrentStep(4);
        }
      }
      
      setLoading(false);
    };
    
    checkOnboardingStatus();
  }, [navigate, currentStep]);
  
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleCreateAccount = () => {
    setCurrentStep(4);
  };
  
  const handleContinueAnyway = () => {
    navigate("/home");
  };
  
  const handleComplete = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      try {
        await supabase
          .from('profiles')
          .update({
            is_onboarded: true
          })
          .eq('id', session.user.id);
          
        toast({
          title: "Welcome to Unmute!",
          description: "Your profile is now ready to use.",
        });
      } catch (error) {
        console.error("Error completing onboarding:", error);
      }
    }
    
    navigate("/home");
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
        return <AccountCreationStep onNext={handleNext} />;
      case 5:
        return <InterestsStep onNext={handleNext} />;
      case 6:
        return <ProfileSetupStep onNext={handleNext} />;
      case 7:
        return <FinalWelcomeStep onComplete={handleComplete} />;
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
