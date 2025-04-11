
import React, { useState, useEffect } from "react";

const prompts = [
  "What's one small thing you're grateful for today?",
  "How would you describe your current mental state in three words?",
  "What's something that made you smile this week?",
  "If your emotions had a color right now, what would it be and why?",
  "What's one thing you'd like to tell yourself right now?",
  "What are you looking forward to in the near future?",
  "What's a recent challenge you've overcome?",
  "How have you shown yourself kindness recently?",
  "What's something that's been on your mind lately?",
  "If you could do anything today without limitations, what would it be?",
  "What boundaries do you need to set or maintain for your wellbeing?",
  "Who is someone that makes you feel seen and heard?",
  "What's a skill or strength you've relied on recently?",
  "How does your body feel today? Any areas of tension or ease?",
  "What's a small step you could take toward a goal today?"
];

interface JournalingPromptProps {
  className?: string;
}

const JournalingPrompt: React.FC<JournalingPromptProps> = ({ className }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get a deterministic prompt based on the current date
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const dateHash = Array.from(dateString).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const promptIndex = dateHash % prompts.length;
    const selectedPrompt = prompts[promptIndex];
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setPrompt(selectedPrompt);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <h3 className="font-medium text-primary mb-2">Today's Reflection Prompt</h3>
      
      {isLoading ? (
        <div className="animate-pulse h-12 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      ) : (
        <p className="text-lg md:text-xl font-light italic">"{prompt}"</p>
      )}
    </div>
  );
};

export default JournalingPrompt;
