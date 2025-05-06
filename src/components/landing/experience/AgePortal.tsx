
import React from 'react';
import { motion } from 'framer-motion';

type AgeGroup = 'teens' | 'twenties' | 'thirties' | 'forties' | 'fiftyplus' | null;

interface AgePortalProps {
  onSelect: (age: AgeGroup) => void;
  onContinue: () => void;
  selectedAge: AgeGroup;
}

const AgePortal: React.FC<AgePortalProps> = ({ onSelect, onContinue, selectedAge }) => {
  const ages = [
    { id: 'teens', label: '13-19' },
    { id: 'twenties', label: '20-29' },
    { id: 'thirties', label: '30-39' },
    { id: 'forties', label: '40-49' },
    { id: 'fiftyplus', label: '50+' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-5 text-center bg-blue-600/40 bg-opacity-60">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-purple-500/40 z-0"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md">
          One Last Step
        </h1>
        
        <p className="text-xl mb-10 text-white drop-shadow-md">
          To build your perfect space, we need to know one thing.
        </p>
        
        <h2 className="text-2xl font-semibold mb-8 text-white drop-shadow-md">
          How old are you?
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-12">
          {ages.map((age) => (
            <motion.button
              key={age.id}
              onClick={() => onSelect(age.id as AgeGroup)}
              className={`p-6 rounded-xl transition-all border-2 ${
                selectedAge === age.id
                  ? 'bg-white text-blue-700 border-white shadow-lg'
                  : 'bg-white/20 text-white border-white/40 hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl font-medium">{age.label}</span>
            </motion.button>
          ))}
        </div>
        
        <p className="text-sm mb-8 text-white/90 max-w-md mx-auto">
          This helps us personalize your experience. We'll never share this information.
        </p>
        
        <motion.button
          onClick={onContinue}
          disabled={!selectedAge}
          className={`px-8 py-3 rounded-full text-lg font-medium ${
            selectedAge
              ? 'bg-white text-blue-700 hover:bg-opacity-90'
              : 'bg-white/30 text-white/70 cursor-not-allowed'
          }`}
          whileHover={selectedAge ? { scale: 1.05 } : {}}
          whileTap={selectedAge ? { scale: 0.98 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
};

export default AgePortal;
