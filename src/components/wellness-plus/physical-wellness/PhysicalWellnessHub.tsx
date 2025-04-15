
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CircleUser, Heart, CalendarCheck, BookOpen, Dumbbell, Utensils, Video, BookText, Users, ScrollText, Settings, Sparkles } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserSetting, updateUserSetting } from "@/services/user-settings-service";
import EntryQuiz from './EntryQuiz';
import SectionCard from './SectionCard';
import { PhysicalWellnessPreference } from './types';

// Dummy data for sections
const wellnessSections = [
  {
    id: 'body-image',
    title: 'Body Image & Confidence',
    description: 'Develop a healthier relationship with your body and build genuine confidence.',
    icon: 'Heart',
    color: 'bg-red-100 text-red-500',
    forIdentities: 'all'
  },
  {
    id: 'hormones-puberty',
    title: 'Hormones & Puberty 101',
    description: 'Understanding the changes your body is going through and how to navigate them.',
    icon: 'CalendarCheck',
    color: 'bg-blue-100 text-blue-500',
    forIdentities: 'all'
  },
  {
    id: 'dysphoria-support',
    title: 'Dysphoria & Discomfort Support',
    description: 'Tools and guidance for when you don\'t feel at home in your body.',
    icon: 'Heart',
    color: 'bg-purple-100 text-purple-500',
    forIdentities: 'all'
  },
  {
    id: 'fitness',
    title: 'Fitness Without Shame',
    description: 'Movement styles for mood and strength without obsession.',
    icon: 'Dumbbell',
    color: 'bg-green-100 text-green-500',
    forIdentities: 'all'
  },
  {
    id: 'nutrition',
    title: 'Nutrition = Fuel, Not Morality',
    description: 'The basics of eating to feel good without judgment.',
    icon: 'Utensils',
    color: 'bg-yellow-100 text-yellow-500',
    forIdentities: 'all'
  },
  {
    id: 'mirror-series',
    title: 'The Mirror Series',
    description: 'Audio and video reflections on body image and self-perception.',
    icon: 'Video',
    color: 'bg-indigo-100 text-indigo-500',
    forIdentities: 'all'
  },
  {
    id: 'faith-identity',
    title: 'Faith, Masculinity, Femininity & Identity',
    description: 'Spiritual reflection and exploration of gender identity.',
    icon: 'BookText',
    color: 'bg-teal-100 text-teal-500',
    forIdentities: 'all'
  },
  {
    id: 'community',
    title: 'Community Room',
    description: 'Private discussion spaces for sharing experiences and support.',
    icon: 'Users',
    color: 'bg-orange-100 text-orange-500',
    forIdentities: 'all'
  },
  {
    id: 'trackers',
    title: 'Trackers & Tools',
    description: 'Journal and track your physical and emotional well-being.',
    icon: 'ScrollText',
    color: 'bg-cyan-100 text-cyan-500',
    forIdentities: 'all'
  },
];

const PhysicalWellnessHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<PhysicalWellnessPreference | null>(null);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('explore');
  
  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        try {
          const userPreferences = await getUserSetting(user.id, "physicalWellnessPreferences");
          if (userPreferences) {
            setPreferences(userPreferences);
            setHasCompletedQuiz(true);
          }
        } catch (error) {
          console.error("Error loading preferences:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, [user]);
  
  // Handle quiz completion
  const handleQuizComplete = (newPreferences: PhysicalWellnessPreference) => {
    setPreferences(newPreferences);
    setHasCompletedQuiz(true);
  };
  
  // Toggle soft mode
  const toggleSoftMode = async () => {
    if (!preferences || !user) return;
    
    try {
      const updatedPreferences = {
        ...preferences,
        softMode: !preferences.softMode
      };
      
      await updateUserSetting(user.id, "physicalWellnessPreferences", updatedPreferences);
      setPreferences(updatedPreferences);
      
      toast({
        title: updatedPreferences.softMode ? "Soft Mode enabled" : "Soft Mode disabled",
        description: updatedPreferences.softMode ? "Using minimal words, visual-first layout." : "Using standard layout."
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error updating preferences",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Toggle hide triggering content
  const toggleHideTriggering = async () => {
    if (!preferences || !user) return;
    
    try {
      const updatedPreferences = {
        ...preferences,
        hideTriggering: !preferences.hideTriggering
      };
      
      await updateUserSetting(user.id, "physicalWellnessPreferences", updatedPreferences);
      setPreferences(updatedPreferences);
      
      toast({
        title: updatedPreferences.hideTriggering ? "Triggering content hidden" : "All content shown",
        description: updatedPreferences.hideTriggering ? "Potentially triggering content will be hidden." : "All content will be shown."
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error updating preferences",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Retake quiz
  const handleRetakeQuiz = () => {
    setHasCompletedQuiz(false);
  };
  
  // Filtered sections based on user identity
  const filteredSections = wellnessSections.filter(section => 
    !preferences || 
    section.forIdentities === 'all' || 
    (Array.isArray(section.forIdentities) && section.forIdentities.includes(preferences.genderIdentity))
  );
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Render quiz if not completed
  if (!hasCompletedQuiz) {
    return <EntryQuiz onComplete={handleQuizComplete} />;
  }
  
  // Get identity-specific greeting
  const getIdentityGreeting = () => {
    if (!preferences) return "Welcome to your Physical Wellness Hub";
    
    switch (preferences.genderIdentity) {
      case 'male':
        return "Welcome to your Physical Wellness Hub, brother";
      case 'female':
        return "Welcome to your Physical Wellness Hub, sister";
      case 'intersex':
        return "Welcome to your Physical Wellness Hub, friend";
      case 'unsure':
        return "Welcome to your Physical Wellness Hub, explorer";
      default:
        return "Welcome to your Physical Wellness Hub";
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className={`overflow-hidden ${preferences?.softMode ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''}`}>
        <div className="relative">
          {!preferences?.softMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-blue-50 opacity-50"></div>
          )}
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl md:text-2xl">{getIdentityGreeting()}</CardTitle>
                <CardDescription className="mt-2">
                  Real talk. Real changes. Real support.
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRetakeQuiz}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="soft-mode" 
                  checked={preferences?.softMode || false}
                  onCheckedChange={toggleSoftMode}
                />
                <Label htmlFor="soft-mode">Soft Mode</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="hide-triggering" 
                  checked={preferences?.hideTriggering || false}
                  onCheckedChange={toggleHideTriggering}
                />
                <Label htmlFor="hide-triggering">Hide Triggering Content</Label>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="explore">
            <Sparkles className="h-4 w-4 mr-2" />
            Explore
          </TabsTrigger>
          <TabsTrigger value="my-content">
            <BookOpen className="h-4 w-4 mr-2" />
            My Content
          </TabsTrigger>
          <TabsTrigger value="journal">
            <ScrollText className="h-4 w-4 mr-2" />
            Journal
          </TabsTrigger>
        </TabsList>
        
        {/* Explore Tab */}
        <TabsContent value="explore" className="space-y-6">
          <h2 className="text-xl font-semibold">Explore Wellness Content</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSections.map(section => (
              <SectionCard 
                key={section.id}
                section={section}
                preferences={preferences}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* My Content Tab */}
        <TabsContent value="my-content">
          <Card>
            <CardHeader>
              <CardTitle>My Saved Content</CardTitle>
              <CardDescription>
                Content you've saved for later will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mb-4 opacity-50" />
                <p>You haven't saved any content yet</p>
                <Button variant="link" onClick={() => setActiveTab('explore')}>
                  Explore content to save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Journal Tab */}
        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle>My Body Journal</CardTitle>
              <CardDescription>
                Track how you feel in your body, both physically and emotionally.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <ScrollText className="h-12 w-12 mb-4 opacity-50" />
                <p>Your journal entries will appear here</p>
                <Button variant="outline" className="mt-2">
                  Create New Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhysicalWellnessHub;
