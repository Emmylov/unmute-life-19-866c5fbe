
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Check, Shuffle, HelpCircle, Sparkles } from 'lucide-react';
import SuccessConfetti from '@/components/content-creator/SuccessConfetti';
import { Badge } from '@/components/ui/badge';

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
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintText, setHintText] = useState('');
  const [streak, setStreak] = useState(0);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
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
    setHintText('');
    setHintsUsed(0);
  };

  // Check user's answer
  const checkAnswer = () => {
    if (userInput.toLowerCase().trim() === currentWord.toLowerCase()) {
      // Correct answer
      const newScore = score + 1 + (5 - hintsUsed > 0 ? 5 - hintsUsed : 0);
      setScore(newScore);
      setStreak(streak + 1);
      setShowConfetti(true);
      setShowWinAnimation(true);
      
      setTimeout(() => {
        setShowConfetti(false);
        setShowWinAnimation(false);
      }, 3000);
      
      toast({
        title: "Correct! 🎉",
        description: getEncouragingMessage(),
        duration: 3000,
      });
      
      getNewWord();
    } else {
      // Incorrect answer
      setStreak(0);
      toast({
        title: "Not quite right",
        description: "Try again, you've got this!",
        duration: 3000,
      });
    }
  };

  const getHint = () => {
    if (hintsUsed >= 3) {
      toast({
        title: "Maximum hints used",
        description: "Try solving this one on your own!",
        duration: 2000,
      });
      return;
    }

    let newHint = '';
    const hintOptions = [
      // First hint: reveal first letter
      () => `Starts with "${currentWord[0].toUpperCase()}"`,
      // Second hint: reveal length and first+last letter
      () => `${currentWord.length} letters, starts with "${currentWord[0].toUpperCase()}" and ends with "${currentWord[currentWord.length-1]}"`,
      // Third hint: reveal half the word with dashes
      () => {
        const halfLength = Math.floor(currentWord.length / 2);
        const revealedPart = currentWord.substring(0, halfLength).toUpperCase();
        const hiddenPart = '-'.repeat(currentWord.length - halfLength);
        return `First half: "${revealedPart}${hiddenPart}"`;
      }
    ];

    newHint = hintOptions[hintsUsed]();
    setHintText(newHint);
    setHintsUsed(hintsUsed + 1);
    
    toast({
      title: `Hint ${hintsUsed + 1} used`,
      description: "Each hint reduces your potential points for this word.",
      duration: 2000,
    });
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
              
              {hintText && (
                <div className="bg-yellow-100 p-3 rounded-lg mb-6 text-yellow-800">
                  <p className="font-medium">Hint: {hintText}</p>
                </div>
              )}
              
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
                    onClick={getHint} 
                    variant="outline"
                    disabled={hintsUsed >= 3}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" /> Hint
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
            
            <div className="flex justify-center gap-6">
              <div className="bg-primary/5 p-4 rounded-lg inline-block">
                <p className="font-medium">Score: {score}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg inline-block">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <p className="font-medium">Streak: {streak}</p>
                </div>
              </div>
            </div>
            
            {streak >= 3 && (
              <div className="mt-4">
                <Badge variant="outline" className="bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900">
                  Hot Streak: {streak} words in a row!
                </Badge>
              </div>
            )}
          </div>
        </motion.div>
        
        {showConfetti && <SuccessConfetti />}
        
        {showWinAnimation && (
          <motion.div 
            className="fixed inset-0 pointer-events-none flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="bg-primary/20 backdrop-blur-sm p-10 rounded-full">
              <motion.div 
                className="text-4xl font-bold text-primary"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 1,
                  repeat: 1
                }}
              >
                Great Job!
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default WordScramble;
