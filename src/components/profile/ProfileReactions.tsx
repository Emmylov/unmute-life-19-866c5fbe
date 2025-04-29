
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addProfileReaction } from "@/integrations/supabase/profile-functions";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileReactionsProps {
  profileId: string;
  profileName: string;
}

const ProfileReactions = ({ profileId, profileName }: ProfileReactionsProps) => {
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);
  const { user } = useAuth();
  
  const emojis = [
    { emoji: "😍", description: "Love It" },
    { emoji: "🔥", description: "Fire" },
    { emoji: "🤯", description: "Mind Blown" }, 
    { emoji: "🥹", description: "Touched" },
    { emoji: "👏", description: "Applause" }, 
    { emoji: "💪", description: "Strong" }
  ];
  
  const triggerEmojiAnimation = async (emoji: string) => {
    if (!user) {
      toast.error("Please sign in to react");
      return;
    }
    
    // Set active emoji for animation
    setActiveEmoji(emoji);
    
    // Reset after animation completes
    setTimeout(() => setActiveEmoji(null), 1000);
    
    try {
      // Save reaction to database
      await addProfileReaction(
        user.id,
        profileId,
        emoji
      );
      
      toast.success(`You reacted with ${emoji}`);
    } catch (error) {
      console.error("Error saving reaction:", error);
      toast.error("Could not save your reaction");
    }
  };

  return (
    <div className="p-3 mb-6 bg-white rounded-xl shadow-sm">
      <p className="text-sm text-gray-600 mb-2">
        React to {profileName.split(' ')[0]}'s vibe today:
      </p>
      <div className="flex space-x-4 justify-around">
        <AnimatePresence>
          {emojis.map((item) => (
            <motion.button
              key={item.emoji}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="relative group"
              onClick={() => triggerEmojiAnimation(item.emoji)}
            >
              <span className="text-2xl transition-transform">
                {item.emoji}
              </span>
              
              {/* The floating animation when emoji is clicked */}
              <AnimatePresence>
                {activeEmoji === item.emoji && (
                  <motion.div 
                    className="absolute -top-1 left-1/2 -translate-x-1/2 text-3xl pointer-events-none"
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{ y: -40, opacity: 0, scale: 2.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    {item.emoji}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Tooltip on hover */}
              <motion.div 
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                {item.description}
              </motion.div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileReactions;
