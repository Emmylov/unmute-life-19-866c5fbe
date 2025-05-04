
import React, { useState, useEffect, useRef } from "react";
import { ArrowDown, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle video loaded
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    // Try to autoplay with sound if possible
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play with sound was prevented, mute and try again
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(err => console.error("Could not play video:", err));
          }
        });
      }
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  // Scroll to journey quiz section
  const scrollToJourneyQuiz = () => {
    const journeyQuizSection = document.getElementById("journey-quiz");
    if (journeyQuizSection) {
      journeyQuizSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-10"></div>
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          loop
          onLoadedData={handleVideoLoaded}
          poster="https://lovable-uploads.s3.amazonaws.com/08c4eb5b-4415-4b24-95f0-9dcb194018b2.png"
        >
          <source src="https://lovable-uploads.s3.amazonaws.com/default/founder-story.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-white text-center px-4 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Welcome to </span>
            <span className="text-blue-400">Unmute</span>
          </h1>
          <h2 className="text-2xl md:text-3xl mb-10 text-white/90">
            A Safe Place to Be Loud
          </h2>
        </motion.div>
        
        {/* Message */}
        <motion.div variants={itemVariants} className="mb-12">
          <p className="text-lg md:text-xl leading-relaxed bg-black/40 p-5 rounded-xl backdrop-blur-md border border-white/10">
            "You're not too loud. You're not too sensitive. You're not too old. You're not too young. 
            You're just right — and you belong here."
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col items-center space-y-6">
          <Button 
            onClick={scrollToJourneyQuiz}
            className="text-white bg-blue-500 hover:bg-blue-600 px-8 py-6 h-auto rounded-full text-lg flex items-center gap-2 shadow-lg shadow-blue-500/30"
            size="lg"
          >
            Start My Journey
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </Button>
          
          <button onClick={toggleMute} className="flex items-center text-sm text-white/80 hover:text-white">
            <span className="mr-2">{isMuted ? "Unmute" : "Mute"} voiceover</span>
            <div className={`w-8 h-4 rounded-full transition-colors ${isMuted ? 'bg-gray-500' : 'bg-blue-500'} relative`}>
              <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${isMuted ? '' : 'translate-x-4'}`}></div>
            </div>
          </button>
        </motion.div>
      </motion.div>
      
      {/* Floating Testimonials */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute text-white/60 text-sm px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
          style={{ top: '20%', left: '10%' }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          "This app saved my relationship with myself."
        </motion.div>
        
        <motion.div
          className="absolute text-white/60 text-sm px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
          style={{ top: '60%', right: '15%' }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 4,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          "I cried the first time I used Unmute."
        </motion.div>
        
        <motion.div
          className="absolute text-white/60 text-sm px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
          style={{ bottom: '25%', left: '20%' }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 6,
            delay: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          "I'm 42. And I finally feel seen."
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-white" />
      </div>
    </section>
  );
};

export default HeroSection;
