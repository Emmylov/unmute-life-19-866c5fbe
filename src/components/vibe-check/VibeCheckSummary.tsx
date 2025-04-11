
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, ArrowRight, ThumbsUp, Sparkles } from "lucide-react";

interface VibeCheckSummaryProps {
  moodData: {
    mood: number;
    energy: number;
    anxiety: number;
    motivation: number;
    peace: number;
  };
  textReflection?: string;
  audioUrl?: string | null;
  imageUrl?: string | null;
  drawingUrl?: string | null;
  onNewCheck: () => void;
}

const VibeCheckSummary: React.FC<VibeCheckSummaryProps> = ({ 
  moodData, 
  textReflection,
  audioUrl,
  imageUrl,
  drawingUrl,
  onNewCheck 
}) => {
  // Calculate overall mood score
  const calculateOverallMood = () => {
    // Convert anxiety to positive scale (higher is better)
    const positiveAnxiety = 100 - moodData.anxiety;
    
    // Average all metrics
    const average = (moodData.mood + moodData.energy + positiveAnxiety + moodData.motivation + moodData.peace) / 5;
    
    if (average >= 70) {
      return { emoji: "😊", text: "You're doing great!" };
    } else if (average >= 40) {
      return { emoji: "😌", text: "You're holding steady." };
    } else {
      return { emoji: "🫂", text: "It's okay to have tough days." };
    }
  };

  const overallMood = calculateOverallMood();

  // Suggested content based on mood
  const getSuggestedContent = () => {
    const positiveAnxiety = 100 - moodData.anxiety;
    const peaceful = moodData.peace >= 60;
    const highEnergy = moodData.energy >= 60;
    const highMotivation = moodData.motivation >= 60;
    
    if (positiveAnxiety < 40) {
      return [
        { title: "5-Minute Breathing Exercise", type: "Wellness" },
        { title: "Anxiety Support Circle", type: "Community" },
        { title: "Anxiety Journaling Prompts", type: "Resource" },
      ];
    } else if (!peaceful) {
      return [
        { title: "Guided Meditation for Peace", type: "Audio" },
        { title: "Nature Sounds Playlist", type: "Audio" },
        { title: "Finding Inner Calm", type: "Article" },
      ];
    } else if (!highEnergy && !highMotivation) {
      return [
        { title: "Motivational Stories", type: "Community" },
        { title: "Quick Energy Boosting Tips", type: "Resource" },
        { title: "Morning Routine Ideas", type: "Article" },
      ];
    } else {
      return [
        { title: "Creative Expression Circle", type: "Community" },
        { title: "Gratitude Practices", type: "Resource" },
        { title: "Wellness Celebration Stories", type: "Community" },
      ];
    }
  };

  const suggestedContent = getSuggestedContent();

  // Get reflection snapshot message
  const getReflectionMessage = () => {
    if (moodData.anxiety > 70) {
      return "I notice you're feeling anxious today. Remember that it's okay to take breaks and practice self-care.";
    } else if (moodData.mood < 30) {
      return "Your mood seems low today. Be gentle with yourself and remember that every feeling is temporary.";
    } else if (moodData.energy < 30) {
      return "Your energy is a bit low. Consider what might help restore you - rest, nature, connection, or movement.";
    } else if (moodData.motivation < 30) {
      return "Motivation is running low. That's okay - sometimes we need to rest before we can move forward again.";
    } else if (moodData.peace < 30) {
      return "You seem to be seeking more peace. What small moments of calm could you create in your day?";
    } else if (moodData.mood > 70 && moodData.peace > 70) {
      return "You're in a great headspace! This is a good time to engage with activities that bring you joy.";
    } else {
      return "Thank you for checking in with yourself today. Regular reflection helps build emotional awareness.";
    }
  };

  const reflectionMessage = getReflectionMessage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cosmic-crush">
          Vibe Check Complete
        </h1>
        <Button 
          variant="outline" 
          onClick={onNewCheck}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          New Check
        </Button>
      </div>

      <Card className="border-none shadow-lg bg-dream-mist/30">
        <CardContent className="p-6 text-center">
          <div className="text-5xl mb-4">{overallMood.emoji}</div>
          <h2 className="text-xl font-medium mb-2">{overallMood.text}</h2>
          <p className="text-gray-600 dark:text-gray-300">{reflectionMessage}</p>
        </CardContent>
      </Card>

      {(textReflection || audioUrl || imageUrl || drawingUrl) && (
        <div>
          <h2 className="text-lg font-medium mb-4">Your Expression</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {textReflection && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Written Reflection</h3>
                  <p className="italic">"{textReflection}"</p>
                </CardContent>
              </Card>
            )}
            
            {audioUrl && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Voice Reflection</h3>
                  <audio controls src={audioUrl} className="w-full mt-2" />
                </CardContent>
              </Card>
            )}
            
            {imageUrl && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Visual Reflection</h3>
                  <img src={imageUrl} alt="Your reflection" className="max-h-[200px] mx-auto object-contain" />
                </CardContent>
              </Card>
            )}
            
            {drawingUrl && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Drawing Reflection</h3>
                  <img src={drawingUrl} alt="Your drawing" className="max-h-[200px] mx-auto object-contain" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedContent.map((content, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-gray-500">{content.type}</p>
                  </div>
                  {content.type === "Community" ? (
                    <ThumbsUp className="h-5 w-5 text-primary" />
                  ) : content.type === "Resource" ? (
                    <Sparkles className="h-5 w-5 text-amber-500" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default VibeCheckSummary;
