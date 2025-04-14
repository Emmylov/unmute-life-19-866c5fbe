
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

interface UnmuteRitualStepProps {
  onNext: () => void;
}

const UnmuteRitualStep = ({ onNext }: UnmuteRitualStepProps) => {
  const [reflection, setReflection] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = () => {
    if (reflection) {
      setHasSubmitted(true);
      setTimeout(() => {
        onNext();
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2">Your Unmute Ritual</h2>
      <p className="text-gray-600 mb-8 text-center">
        Take a moment to ground yourself
      </p>

      <div className="w-full max-w-md mb-8">
        {!hasSubmitted ? (
          <div className="space-y-6">
            <div className="breathing-circle animate-pulse w-24 h-24 rounded-full bg-gradient-to-r from-unmute-purple to-unmute-pink mx-auto mb-6" />
            
            <p className="text-center mb-4">
              What's something you're ready to let go of?
            </p>

            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Type your thoughts here..."
              className="min-h-[100px] mb-4"
            />

            <Button
              onClick={handleSubmit}
              className="unmute-primary-button w-full"
              disabled={!reflection}
            >
              Release & Continue
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ duration: 2 }}
              className="text-center"
            >
              <p className="text-xl text-unmute-purple mb-2">Letting go...</p>
              <p className="text-gray-600">{reflection}</p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default UnmuteRitualStep;
