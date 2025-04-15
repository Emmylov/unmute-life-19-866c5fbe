import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, HelpCircle } from "lucide-react";
import { GenderIdentity, PhysicalWellnessPreference } from './types';
import { updateUserSetting } from "@/services/user-settings-service";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-responsive";

interface EntryQuizProps {
  onComplete: (preferences: PhysicalWellnessPreference) => void;
}

const EntryQuiz: React.FC<EntryQuizProps> = ({ onComplete }) => {
  const [genderIdentity, setGenderIdentity] = useState<GenderIdentity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleSubmit = async () => {
    if (!genderIdentity) {
      toast({
        title: "Please make a selection",
        description: "We need this information to personalize your experience.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const preferences: PhysicalWellnessPreference = {
        genderIdentity,
        softMode: false,
        hideTriggering: false,
      };
      
      if (user) {
        await updateUserSetting(user.id, "physicalWellnessPreferences", preferences);
      }
      
      onComplete(preferences);
      
      toast({
        title: "Preferences saved",
        description: "Your content has been personalized based on your selection."
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error saving preferences",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl">My Body, My Home</CardTitle>
        <CardDescription className="text-sm sm:text-base mt-2">
          We all experience our bodies differently. This will help us show you content that fits where you're coming from.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg font-medium">Which of these best describes your physical experience right now?</h3>
          
          <RadioGroup value={genderIdentity || ''} onValueChange={(value) => setGenderIdentity(value as GenderIdentity)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <label 
                className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                htmlFor="male"
              >
                <RadioGroupItem value="male" id="male" />
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <div className="text-sm sm:text-base">I'm a boy / male</div>
              </label>
              
              <label 
                className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                htmlFor="female"
              >
                <RadioGroupItem value="female" id="female" />
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                <div className="text-sm sm:text-base">I'm a girl / female</div>
              </label>
              
              <label 
                className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                htmlFor="intersex"
              >
                <RadioGroupItem value="intersex" id="intersex" />
                <div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  <span className="text-base sm:text-lg text-purple-500">⚧</span>
                </div>
                <div className="text-sm sm:text-base">I'm intersex</div>
              </label>
              
              <label 
                className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                htmlFor="unsure"
              >
                <RadioGroupItem value="unsure" id="unsure" />
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                <div className="text-sm sm:text-base">I'm not sure right now</div>
              </label>
              
              <label 
                className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors sm:col-span-2"
                htmlFor="prefer_not_to_say"
              >
                <RadioGroupItem value="prefer_not_to_say" id="prefer_not_to_say" />
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <div className="text-sm sm:text-base">I'd rather not say</div>
              </label>
            </div>
          </RadioGroup>
          
          <p className="text-xs sm:text-sm text-muted-foreground">
            Based on this, content will be curated for you. You can update this anytime in your settings.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center p-4 sm:p-6">
        <Button 
          onClick={handleSubmit} 
          disabled={!genderIdentity || isSubmitting}
          className="w-full sm:w-auto"
        >
          Continue to Wellness Hub
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EntryQuiz;
