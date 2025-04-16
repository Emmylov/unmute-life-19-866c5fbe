
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Check, Shuffle } from 'lucide-react';
import SuccessConfetti from '@/components/content-creator/SuccessConfetti';

// List of positive words
const POSITIVE_WORDS = [
  'happy', 'joyful', 'smile', 'bright', 'hopeful', 
  'strong', 'brave', 'achieve', 'succeed', 'believe',
  'inspire', 'create', 'imagine', 'dream', 'peace',
  'calm', 'relax', 'focus', 'mindful', 'grateful'
];

const WordScramble = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  // Initialize the game
  useEffect(() => {
    getNewWord();
  }, []);

  // Function to scramble a word
  const scrambleWord = (word: string) => {
    const array = word.split('');
    let currentIndex = array.length;

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    const scrambled = array.join('');
    // Make sure it's actually scrambled and not the same as original
    if (scrambled === word && word.length > 1) {
      return scrambleWord(word);
    }
    return scrambled;
  };

  // Get a new word to play
  const getNewWord = () => {
    const randomIndex = Math.floor(Math.random() * POSITIVE_WORDS.length);
    const word = POSITIVE_WORDS[randomIndex];
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setUserInput('');
  };

  // Check user's answer
  const checkAnswer = () => {
    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      // Correct answer
      setScore(prevScore => prevScore + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      toast({
        title: "Correct! 🎉",
        description: getEncouragingMessage(),
        duration: 3000,
      });
      
      getNewWord();
    } else {
      // Incorrect answer
      toast({
        title: "Not quite right",
        description: "Try again, you've got this!",
        duration: 3000,
      });
    }
  };

  const getEncouragingMessage = () => {
    const messages = [
      "Amazing job! You're so good at this!",
      "Your brain power is incredible!",
      "You're unstoppable! Keep going!",
      "Brilliant! Your vocabulary is impressive!",
      "You've got such a positive mindset!",
      "Fantastic work! Keep that momentum going!",
      "You're making great progress!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <AppLayout pageTitle="Word Scramble">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 text-center"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Word Scramble</h1>
            <p className="text-gray-600 mb-6">Unscramble positive words to boost your mood!</p>
            
            <div className="bg-primary/10 rounded-xl p-8 mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shuffle className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">Scrambled Word:</h2>
              </div>
              <p className="text-4xl font-bold tracking-wider mb-6 text-primary">
                {scrambledWord.toUpperCase()}
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your answer..."
                    className="text-center text-xl"
                    autoComplete="off"
                  />
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={checkAnswer}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Check className="w-4 h-4 mr-2" /> Check
                  </Button>
                  <Button 
                    onClick={getNewWord} 
                    variant="outline"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Skip
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg inline-block">
              <p className="font-medium">Score: {score}</p>
            </div>
          </div>
        </motion.div>
        
        {showConfetti && <SuccessConfetti />}
      </div>
    </AppLayout>
  );
};

export default WordScramble;
