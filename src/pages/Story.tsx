
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/shared/SEO";

const Story = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  
  // Story content with proper structure to avoid "undefined" text
  const storyPages = [
    {
      title: "The Day I Lost My Voice",
      content: "Once, I had a voice. It was loud. Too loud, they said. Then one day, I muted myself."
    },
    {
      title: "The Silence",
      content: "The silence was deafening. My thoughts screamed but my lips stayed still. No one heard me anymore."
    },
    {
      title: "Finding Unmute",
      content: "Until I found this place. A community where voices like mine matter. Where being loud isn't wrong."
    },
    {
      title: "Speaking Again",
      content: "Here, I speak again. My voice trembles at first, but grows stronger with every word, with every connection."
    },
    {
      title: "Join Us",
      content: "This is Unmute. A place to be heard. Will you join us and unmute your voice?"
    }
  ];
  
  const handleContinue = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate("/auth");
    }
  };
  
  const handleSkip = () => {
    navigate("/auth");
  };
  
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col justify-center items-center overflow-hidden">
      <SEO 
        title={`Unmute Story | ${storyPages[currentPage].title}`}
        description="Discover the Unmute story - a journey from silence to being heard."
      />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/30 to-black"></div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-lg px-6 py-20 text-center"
        key={currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-8 text-primary-blue"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {storyPages[currentPage].title}
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {storyPages[currentPage].content}
        </motion.p>
        
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button 
            onClick={handleContinue} 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto rounded-full"
          >
            {currentPage < storyPages.length - 1 ? "Continue" : "Get Started"}
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Skip button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
        <Button 
          variant="ghost" 
          onClick={handleSkip}
          className="text-white/60 hover:text-white"
        >
          Skip Story
        </Button>
        
        <div className="mt-4 flex space-x-2">
          <span className="text-xs text-white/40">Scroll</span>
          <motion.div 
            animate={{ y: [0, 5, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12L3 7L4.4 5.55L8 9.15L11.6 5.55L13 7L8 12Z" fill="white" fillOpacity="0.4"/>
            </svg>
          </motion.div>
          <span className="text-xs text-white/40">Scroll</span>
        </div>
      </div>
    </div>
  );
};

export default Story;
