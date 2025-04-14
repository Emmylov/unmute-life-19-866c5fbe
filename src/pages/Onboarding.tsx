
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import WhyDidYouComeStep from "@/components/onboarding/WhyDidYouComeStep";
import FeelingStep from "@/components/onboarding/FeelingStep";
import ExpressionStyleStep from "@/components/onboarding/ExpressionStyleStep";
import InterestsStep from "@/components/onboarding/InterestsStep";
import CommunityRecommendationsStep from "@/components/onboarding/CommunityRecommendationsStep";
import ProfileSetupStep from "@/components/onboarding/ProfileSetupStep";
import WellnessSpaceStep from "@/components/onboarding/WellnessSpaceStep";
import UnmuteRitualStep from "@/components/onboarding/UnmuteRitualStep";
import FirstUnmuteStep from "@/components/onboarding/FirstUnmuteStep";
import FeedWelcomeStep from "@/components/onboarding/FeedWelcomeStep";
import CustomizeExperienceStep from "@/components/onboarding/CustomizeExperienceStep";
import { supabase } from "@/integrations/supabase/client";
import { trackAnalyticEvent } from "@/services/analytics-service";
import { updateOnboardingStep, saveOnboardingData } from "@/services/user-settings-service";
import { useAuth } from "@/contexts/AuthContext";

const TOTAL_STEPS = 12;

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>({
    whyCame: [],
    feeling: "",
    expressionStyle: "",
    interests: [],
    communities: [],
    username: "",
    fullName: "",
    bio: "",
    avatar: null,
    wellnessAreas: [],
    ritualReflection: "",
    firstUnmute: null,
    customizationPrefs: {
      showEmotionalContent: true,
      showAnonymousPosts: true,
      limitIntenseTopics: false,
      soundOnByDefault: true,
      emailUpdates: false
    }
  });
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        setIsLoggedIn(true);
        
        if (profile) {
          setOnboardingData({
            ...onboardingData,
            username: profile.username,
            fullName: profile.full_name,
            bio: profile.bio,
            avatar: profile.avatar,
            interests: profile.interests || [],
          });
          
          if (profile.is_onboarded) {
            navigate('/home');
            return;
          }
          
          // If the user is logged in but not onboarded, start from profile setup step
          // This is now step 7 in our new flow
          if (currentStep < 6) {
            setCurrentStep(6);
            
            // Update onboarding step in database
            try {
              await updateOnboardingStep(user.id, 'profile-setup');
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
        trackAnalyticEvent(user.id, "onboarding_step_complete", { 
          resource_type: "onboarding", 
          step: currentStep, 
          next_step: nextStep 
        });
        
        // Update onboarding step in database
        try {
          let stepName = "";
          switch (nextStep) {
            case 0: stepName = "welcome"; break;
            case 1: stepName = "why-came"; break;
            case 2: stepName = "feeling"; break;
            case 3: stepName = "expression-style"; break;
            case 4: stepName = "interests"; break;
            case 5: stepName = "community-recommendations"; break;
            case 6: stepName = "profile-setup"; break;
            case 7: stepName = "wellness-space"; break;
            case 8: stepName = "unmute-ritual"; break;
            case 9: stepName = "first-unmute"; break;
            case 10: stepName = "feed-welcome"; break;
            case 11: stepName = "customize-experience"; break;
            default: stepName = "welcome"; break;
          }
          
          await updateOnboardingStep(user.id, stepName);
        } catch (error) {
          console.error("Error updating onboarding step:", error);
        }
      }
    }
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
      trackAnalyticEvent(user.id, "onboarding_complete", { resource_type: "onboarding" });
      
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
        return "bg-gradient-to-br from-blue-500/20 to-unmute-purple/20";
      case 5:
        return "bg-gradient-to-br from-unmute-purple/20 to-green-500/20";
      case 6:
        return "bg-gradient-to-br from-unmute-pink/20 to-unmute-purple/20";
      case 7:
        return "bg-gradient-to-br from-unmute-teal/20 to-unmute-pink/20";
      case 8:
        return "bg-gradient-to-br from-purple-500/20 to-blue-500/20";
      case 9:
        return "bg-gradient-to-br from-unmute-coral/20 to-unmute-teal/20";
      case 10:
        return "bg-gradient-to-br from-green-500/20 to-unmute-purple/20";
      case 11:
        return "bg-gradient-to-br from-unmute-purple/20 to-unmute-coral/20";
      default:
        return "bg-gradient-to-br from-unmute-purple/20 to-unmute-teal/20";
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <WhyDidYouComeStep 
          onNext={handleNext} 
          onUpdateData={handleUpdateOnboardingData} 
          data={onboardingData.whyCame}
        />;
      case 2:
        return <FeelingStep 
          onNext={handleNext} 
          onUpdateData={handleUpdateOnboardingData} 
          data={onboardingData.feeling}
        />;
      case 3:
        return <ExpressionStyleStep 
          onNext={handleNext} 
          onUpdateData={handleUpdateOnboardingData} 
          data={onboardingData.expressionStyle}
        />;
      case 4:
        return <InterestsStep 
          onNext={handleNext} 
          onUpdateData={handleUpdateOnboardingData}
          data={onboardingData.interests}
        />;
      case 5:
        return <CommunityRecommendationsStep 
          onNext={handleNext} 
          onUpdateData={handleUpdateOnboardingData}
          interests={onboardingData.interests}
          data={onboardingData.communities}
        />;
      case 6:
        return <ProfileSetupStep 
          onNext={handleNext} 
          onUpdateData={handleUpdateOnboardingData}
          data={{
            username: onboardingData.username,
            fullName: onboardingData.fullName,
            bio: onboardingData.bio,
            avatar: onboardingData.avatar
          }}
        />;
      case 7:
        return <WellnessSpaceStep 
          onNext={handleNext} 
          onUpdateData={handleUpdateOnboardingData}
          data={onboardingData.wellnessAreas}
        />;
      case 8:
        return <UnmuteRitualStep 
          onNext={handleNext} 
          onUpdateData={handleUpdateOnboardingData}
          data={onboardingData.ritualReflection}
        />;
      case 9:
        return <FirstUnmuteStep 
          onNext={handleNext} 
          onUpdateData={handleUpdateOnboardingData}
          data={onboardingData.firstUnmute}
        />;
      case 10:
        return <FeedWelcomeStep 
          onNext={handleNext}
        />;
      case 11:
        return <CustomizeExperienceStep 
          onComplete={handleComplete} 
          onUpdateData={handleUpdateOnboardingData}
          data={onboardingData.customizationPrefs}
        />;
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
