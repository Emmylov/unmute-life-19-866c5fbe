
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface AgePortalProps {
  onSelect: (age: 'teens' | 'twenties' | 'thirties' | 'forties' | 'fiftyplus' | null) => void;
  onContinue: () => void;
  selectedAge: 'teens' | 'twenties' | 'thirties' | 'forties' | 'fiftyplus' | null;
}

const ageOptions = [
  { id: 'teens', label: '13-19' },
  { id: 'twenties', label: '20-29' },
  { id: 'thirties', label: '30-39' },
  { id: 'forties', label: '40-49' },
  { id: 'fiftyplus', label: '50+' }
];

const AgePortal = ({ onSelect, onContinue, selectedAge }: AgePortalProps) => {
  useEffect(() => {
    const element = document.getElementById('age-portal');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  return (
    <motion.div
      id="age-portal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-gradient-to-br from-unmute-purple/40 to-unmute-teal/30 flex flex-col items-center justify-center text-white p-4 relative"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-unmute-purple/20 filter blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-unmute-teal/20 filter blur-3xl" />
      
      <div className="max-w-xl w-full z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">One Last Step</h1>
          <p className="text-lg text-gray-100">
            To build your perfect space, we need to know one thing.
          </p>
          <p className="text-xl mt-6 font-medium">
            How old are you?
          </p>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ageOptions.map((option, i) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                onClick={() => onSelect(option.id as any)}
                className={`py-4 px-2 rounded-lg transition-all ${
                  selectedAge === option.id
                    ? 'bg-white text-unmute-purple font-medium shadow-lg'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 text-sm text-center text-gray-200"
          >
            This helps us personalize your experience and connect you with your community.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center"
        >
          <Button
            onClick={onContinue}
            disabled={!selectedAge}
            className="bg-white text-unmute-purple hover:bg-white/90 px-8 py-5 text-lg font-medium rounded-full"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AgePortal;
