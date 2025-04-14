
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WelcomeFeedStepProps {
  onNext: () => void;
}

const samplePosts = [
  {
    id: 1,
    author: "Sarah K.",
    content: "Starting my healing journey today. Grateful for this space 🌱",
  },
  {
    id: 2,
    author: "Mind & Soul Community",
    content: "Daily reminder: You don't have to carry it all alone 💜",
  },
  {
    id: 3,
    author: "Alex T.",
    content: "Found my voice here after years of silence. Keep going everyone ✨",
  },
];

const WelcomeFeedStep = ({ onNext }: WelcomeFeedStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2">Welcome to Your Feed</h2>
      <p className="text-gray-600 mb-8 text-center">
        Your journey starts here. Welcome to the soft side of the internet.
      </p>

      <div className="w-full max-w-md space-y-4 mb-8">
        {samplePosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="unmute-bubble p-4 bg-white"
          >
            <p className="font-medium mb-2">{post.author}</p>
            <p className="text-gray-600">{post.content}</p>
          </motion.div>
        ))}
      </div>

      <Button onClick={onNext} className="unmute-primary-button">
        Continue to customize
      </Button>
    </div>
  );
};

export default WelcomeFeedStep;
