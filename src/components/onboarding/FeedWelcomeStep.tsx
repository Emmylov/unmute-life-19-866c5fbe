
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FeedWelcomeStepProps {
  onNext: () => void;
}

const samplePosts = [
  {
    id: 1,
    user: {
      name: "Alex Rivera",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&background=%23f9d2e1",
      username: "alexr"
    },
    content: "Just joined a climate action group in my area! Excited to make a difference locally. Anyone else taking steps towards sustainability in their community? #ClimateAction",
    posted: "2h ago",
    likes: 24,
    comments: 7
  },
  {
    id: 2,
    user: {
      name: "Sam Taylor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&background=%23d2e9f9",
      username: "samtaylor"
    },
    content: "Today I shared my mental health journey with my study group. Was nervous, but they were so supportive. Remember: your story matters. #MentalHealthMatters",
    posted: "5h ago",
    likes: 42,
    comments: 13
  },
  {
    id: 3,
    user: {
      name: "Jordan Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&background=%23d2f9e4",
      username: "jordanlee"
    },
    content: "Working on a new art project exploring identity and belonging. It's messy and imperfect, but that's what makes it real. Art doesn't have to be perfect to be meaningful.",
    posted: "1d ago",
    likes: 36,
    comments: 9
  }
];

const FeedWelcomeStep = ({ onNext }: FeedWelcomeStepProps) => {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [showAllPosts, setShowAllPosts] = useState(false);
  
  useEffect(() => {
    if (!showAllPosts && currentPostIndex < samplePosts.length - 1) {
      const timer = setTimeout(() => {
        setCurrentPostIndex(currentPostIndex + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentPostIndex, showAllPosts]);
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Welcome to Your Feed</h2>
      <p className="text-center text-gray-600 mb-8">
        Your journey starts here. Welcome to the soft side of the internet.
      </p>
      
      <div className="flex-grow overflow-hidden">
        {!showAllPosts ? (
          <motion.div 
            key={currentPostIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-4 mb-4"
          >
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                <img 
                  src={samplePosts[currentPostIndex].user.avatar} 
                  alt={samplePosts[currentPostIndex].user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-sm">{samplePosts[currentPostIndex].user.name}</h3>
                <p className="text-xs text-gray-500">@{samplePosts[currentPostIndex].user.username} · {samplePosts[currentPostIndex].posted}</p>
              </div>
            </div>
            <p className="text-gray-800 mb-4">{samplePosts[currentPostIndex].content}</p>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-4">{samplePosts[currentPostIndex].likes} likes</span>
              <span>{samplePosts[currentPostIndex].comments} comments</span>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[400px]">
            {samplePosts.map(post => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={post.user.avatar} 
                      alt={post.user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{post.user.name}</h3>
                    <p className="text-xs text-gray-500">@{post.user.username} · {post.posted}</p>
                  </div>
                </div>
                <p className="text-gray-800 mb-4">{post.content}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-4">{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        {!showAllPosts && (
          <Button
            onClick={() => setShowAllPosts(true)}
            variant="outline"
            className="mb-4"
          >
            Show all posts
          </Button>
        )}
        
        <Button 
          onClick={onNext} 
          className="unmute-primary-button w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default FeedWelcomeStep;
