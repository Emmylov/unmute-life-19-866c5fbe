
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Heart, Volume2, Eye, UserCircle, AlertTriangle, Mail } from "lucide-react";
import { toast } from "sonner";

interface CustomizeExperienceStepProps {
  onComplete: () => void;
  onUpdateData: (data: any) => void;
  data: {
    showEmotionalContent: boolean;
    showAnonymousPosts: boolean;
    limitIntenseTopics: boolean;
    soundOnByDefault: boolean;
    emailUpdates: boolean;
  };
}

const CustomizeExperienceStep = ({ onComplete, onUpdateData, data }: CustomizeExperienceStepProps) => {
  const [preferences, setPreferences] = useState({
    showEmotionalContent: data?.showEmotionalContent ?? true,
    showAnonymousPosts: data?.showAnonymousPosts ?? true,
    limitIntenseTopics: data?.limitIntenseTopics ?? false,
    soundOnByDefault: data?.soundOnByDefault ?? true,
    emailUpdates: data?.emailUpdates ?? false
  });
  const [email, setEmail] = useState("");
  
  const handleToggle = (key: string) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key as keyof typeof preferences]
    });
  };
  
  const handleComplete = () => {
    const updatedPrefs = { ...preferences };
    
    if (preferences.emailUpdates && email) {
      // In a real app, we would validate the email format here
      toast.success("Email subscribed", {
        description: "You'll receive updates at " + email
      });
    }
    
    onUpdateData({ customizationPrefs: updatedPrefs });
    onComplete();
  };
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Customize Your Experience</h2>
      <p className="text-center text-gray-600 mb-8">Fine-tune how you want to use Unmute</p>
      
      <div className="space-y-6 flex-grow">
        <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <Heart className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <Label htmlFor="emotional-content" className="font-medium">Show emotional content</Label>
              <p className="text-xs text-gray-500">Posts about mental health, grief, etc.</p>
            </div>
          </div>
          <Switch 
            id="emotional-content" 
            checked={preferences.showEmotionalContent}
            onCheckedChange={() => handleToggle("showEmotionalContent")}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <UserCircle className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <Label htmlFor="anonymous-posts" className="font-medium">Show anonymous posts</Label>
              <p className="text-xs text-gray-500">Content shared without usernames</p>
            </div>
          </div>
          <Switch 
            id="anonymous-posts" 
            checked={preferences.showAnonymousPosts}
            onCheckedChange={() => handleToggle("showAnonymousPosts")}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <Label htmlFor="limit-topics" className="font-medium">Limit intense topics</Label>
              <p className="text-xs text-gray-500">Filter potentially triggering content</p>
            </div>
          </div>
          <Switch 
            id="limit-topics" 
            checked={preferences.limitIntenseTopics}
            onCheckedChange={() => handleToggle("limitIntenseTopics")}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <Volume2 className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <Label htmlFor="sound-default" className="font-medium">Sound/Music on by default</Label>
              <p className="text-xs text-gray-500">Enable audio for a richer experience</p>
            </div>
          </div>
          <Switch 
            id="sound-default" 
            checked={preferences.soundOnByDefault}
            onCheckedChange={() => handleToggle("soundOnByDefault")}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <Mail className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <Label htmlFor="email-updates" className="font-medium">Email updates</Label>
              <p className="text-xs text-gray-500">Receive occasional news and highlights</p>
            </div>
          </div>
          <Switch 
            id="email-updates" 
            checked={preferences.emailUpdates}
            onCheckedChange={() => handleToggle("emailUpdates")}
          />
        </div>
        
        {preferences.emailUpdates && (
          <div className="p-4 rounded-lg bg-white border border-gray-200 mt-2">
            <Label htmlFor="email" className="text-sm font-medium mb-2 block">
              Email address
            </Label>
            <Input 
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-1"
            />
            <p className="text-xs text-gray-500">
              We'll never spam you. You can unsubscribe anytime.
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={handleComplete} 
          className="unmute-primary-button w-full"
        >
          Let's go!
        </Button>
      </div>
    </div>
  );
};

export default CustomizeExperienceStep;
