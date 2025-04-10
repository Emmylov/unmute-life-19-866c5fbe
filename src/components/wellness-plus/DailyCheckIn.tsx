
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MoodOption {
  emoji: string;
  label: string;
  description: string;
  suggestions?: string[];
}

const moodOptions: MoodOption[] = [
  {
    emoji: "😊",
    label: "Happy",
    description: "I'm feeling good today!",
    suggestions: [
      "Celebrate your happiness by doing something kind for someone else.",
      "Write down three things you're grateful for to maintain this positive energy.",
      "Use this positive energy for something creative or productive you've been wanting to do."
    ]
  },
  {
    emoji: "😴",
    label: "Tired",
    description: "I'm feeling exhausted or drained",
    suggestions: [
      "Try to take a short 20-minute power nap if possible.",
      "Consider going to bed 30 minutes earlier tonight.",
      "Reduce your screen time in the evening to improve sleep quality.",
      "Consider a short mindfulness meditation to refresh your mind."
    ]
  },
  {
    emoji: "😰",
    label: "Anxious",
    description: "I'm feeling worried or stressed",
    suggestions: [
      "Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7, exhale for 8.",
      "Write down what's making you anxious, then note which factors are within your control.",
      "Go for a short walk outside to clear your mind.",
      "Limit caffeine and sugar which can increase anxiety symptoms."
    ]
  },
  {
    emoji: "😔",
    label: "Sad",
    description: "I'm feeling down or blue",
    suggestions: [
      "Reach out to a trusted friend or family member.",
      "Do something that normally brings you joy, even if you don't feel like it.",
      "Be kind to yourself – treat yourself as you would treat a good friend who's feeling sad.",
      "Remember that feelings are temporary and will pass with time."
    ]
  },
  {
    emoji: "😩",
    label: "Overwhelmed",
    description: "I have too much on my plate",
    suggestions: [
      "Break down large tasks into smaller, manageable steps.",
      "Consider what tasks you can delegate or postpone.",
      "Take 5 minutes to sit quietly and focus only on your breathing.",
      "Remember that it's okay to say 'no' to new commitments when you're already stretched thin."
    ]
  },
  {
    emoji: "😡",
    label: "Frustrated",
    description: "I'm feeling irritated or angry",
    suggestions: [
      "Step away from the situation temporarily if possible.",
      "Express your feelings by writing them down or talking to someone you trust.",
      "Try physical activity to release tension – even a quick walk can help.",
      "Practice deep breathing to calm your nervous system."
    ]
  }
];

const DailyCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  const { toast } = useToast();

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
    setShowSuggestions(true);
  };

  const handleCompletedCheckIn = () => {
    setCheckInCompleted(true);
    toast({
      title: "Check-in recorded",
      description: "Your daily reflection has been saved.",
    });
  };

  const resetCheckIn = () => {
    setSelectedMood(null);
    setShowSuggestions(false);
    setCheckInCompleted(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>
                Select the emotion that best matches how you're feeling right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!checkInCompleted ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => handleMoodSelect(mood)}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                        selectedMood?.label === mood.label
                          ? "bg-[#E5DEFF] border-2 border-[#9b87f5]"
                          : "bg-white border border-gray-200 hover:border-[#D6BCFA]"
                      }`}
                    >
                      <span className="text-4xl mb-2">{mood.emoji}</span>
                      <span className="font-medium">{mood.label}</span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        {mood.description}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-[#F1F0FB] p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">{selectedMood?.emoji}</div>
                  <h3 className="text-lg font-medium">
                    You're feeling {selectedMood?.label.toLowerCase()}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Thank you for checking in. Your mood has been recorded.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={resetCheckIn}
                  >
                    Check in again
                  </Button>
                </div>
              )}
            </CardContent>
            {selectedMood && !checkInCompleted && (
              <CardFooter className="flex justify-end">
                <Button 
                  className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                  onClick={handleCompletedCheckIn}
                >
                  Save My Check-In
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="md:w-1/3">
          {showSuggestions && selectedMood && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personalized suggestions</CardTitle>
                <CardDescription>
                  Based on your {selectedMood.label.toLowerCase()} mood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {selectedMood.suggestions?.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 text-[#9b87f5]">•</div>
                      <p className="text-sm">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
