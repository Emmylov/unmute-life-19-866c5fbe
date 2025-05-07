
import React, { useState, useEffect, useRef } from "react";
import { ArrowDown, Volume2, VolumeX, ArrowRight, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/utils/sound-effects";
import { Link } from "react-router-dom";

// Story scenes
enum StoryScene {
  INTRO = "intro",
  AVATAR_SELECTION = "avatar",
  NOISE_MAZE = "maze",
  SANCTUARY = "sanctuary",
  MEMORY_LANE = "memory",
  REFLECTION = "reflection",
  AGE_SELECTION = "age",
  READY = "ready"
}

// Avatar options
interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

// Music tracks
interface MusicTrack {
  id: string;
  name: string;
  url: string;
  sceneTypes: StoryScene[];
}

const musicTracks: MusicTrack[] = [
  { 
    id: "ambient", 
    name: "Ambient Reflection", 
    url: "/sounds/ambient-sound.mp3", 
    sceneTypes: [StoryScene.INTRO, StoryScene.SANCTUARY, StoryScene.READY]
  },
  { 
    id: "tension", 
    name: "Inner Tension", 
    url: "/sounds/tension-sound.mp3", 
    sceneTypes: [StoryScene.NOISE_MAZE]
  },
  { 
    id: "memory", 
    name: "Nostalgic Waves", 
    url: "/sounds/memory-lane.mp3", 
    sceneTypes: [StoryScene.MEMORY_LANE, StoryScene.REFLECTION]
  },
  { 
    id: "choice", 
    name: "Decision Point", 
    url: "/sounds/choice-moment.mp3", 
    sceneTypes: [StoryScene.AVATAR_SELECTION, StoryScene.AGE_SELECTION]
  }
];

const avatarOptions: AvatarOption[] = [
  { id: "overthinker", name: "The Overthinker", emoji: "🤔", description: "Always analyzing everything and everyone." },
  { id: "pleaser", name: "The People Pleaser", emoji: "😊", description: "Putting others' needs before your own." },
  { id: "bottledup", name: "The Bottled-Up One", emoji: "😤", description: "Keeping emotions tucked away inside." },
  { id: "trying", name: "The One Who's Trying Again", emoji: "🌱", description: "Taking new steps toward healing." },
  { id: "lost", name: "None of these? I'm just lost.", emoji: "🔍", description: "Still figuring things out." },
];

// Age options
const ageGroups = [
  "16-24", "25-34", "35-44", "45-54", "55+"
];

// Memory options (new)
const memoryPrompts = [
  "A time when you felt silenced",
  "The first moment you realized you needed to speak up",
  "When someone made you feel small",
  "A time you wished someone had listened",
  "The last time you truly felt heard"
];

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentScene, setCurrentScene] = useState<StoryScene>(StoryScene.INTRO);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [currentMusicTrack, setCurrentMusicTrack] = useState<MusicTrack | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Text for each scene
  const sceneTexts = {
    [StoryScene.INTRO]: [
      "Once, I had a voice. It was loud. Too loud, they said.",
      "Then one day, I muted myself."
    ],
    [StoryScene.AVATAR_SELECTION]: [
      "Which version of you resonates the most today?"
    ],
    [StoryScene.NOISE_MAZE]: [
      "You enter the world again. But it's all... noise.",
      "\"Why are you always so emotional?\"",
      "\"You talk too much.\"",
      "\"You're too old for this.\"",
      "\"You're too sensitive.\""
    ],
    [StoryScene.SANCTUARY]: [
      "Welcome. This is Unmute — a sanctuary for real voices, raw stories, and radical belonging."
    ],
    [StoryScene.MEMORY_LANE]: [
      "We all carry moments that shaped our silence.",
      "Select a memory prompt that resonates with you.",
      "You don't need to share it — just hold it in your mind as we continue."
    ],
    [StoryScene.REFLECTION]: [
      "That moment you're holding... it matters.",
      "The words you didn't say then...",
      "You can speak them now.",
      "Or whenever you're ready.",
      "This is a place for those unspoken words."
    ],
    [StoryScene.AGE_SELECTION]: [
      "To build your space, we need to know one thing.",
      "How old are you?"
    ],
    [StoryScene.READY]: [
      "You're not too loud. You're not too sensitive.",
      "You're not too old. You're not too young.",
      "You're just right — and you belong here."
    ],
  };
  
  // Get current text based on scene
  const getCurrentText = () => {
    return sceneTexts[currentScene] || [""];
  };
  
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
    
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  // Switch music track based on scene
  const switchMusicTrack = (scene: StoryScene) => {
    // Find appropriate track for this scene
    const trackForScene = musicTracks.find(track => 
      track.sceneTypes.includes(scene)
    ) || musicTracks[0]; // Default to first track
    
    if (!audioRef.current) {
      audioRef.current = new Audio(trackForScene.url);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.muted = isMuted;
    } else {
      if (currentMusicTrack?.id !== trackForScene.id) {
        audioRef.current.src = trackForScene.url;
      }
    }
    
    setCurrentMusicTrack(trackForScene);
    audioRef.current.play().catch(console.error);
  };
  
  // Type writer effect
  useEffect(() => {
    if (currentScene) {
      const text = getCurrentText().join(" ");
      let index = 0;
      setTypedText("");
      setIsTyping(true);
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setTypedText(prev => prev + text[index]);
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 40);
      
      return () => clearInterval(interval);
    }
  }, [currentScene]);
  
  // Play sound effect when changing scenes and change music track
  useEffect(() => {
    if (currentScene) {
      playSound("click", 0.2).catch(console.error);
      switchMusicTrack(currentScene);
    }
  }, [currentScene]);
  
  // Initialize audio for ambient sound
  useEffect(() => {
    // Initialize with first track
    switchMusicTrack(StoryScene.INTRO);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, []);

  // Continue to next scene
  const continueToNextScene = () => {
    switch (currentScene) {
      case StoryScene.INTRO:
        setCurrentScene(StoryScene.AVATAR_SELECTION);
        break;
      case StoryScene.AVATAR_SELECTION:
        if (selectedAvatar) {
          setCurrentScene(StoryScene.NOISE_MAZE);
        }
        break;
      case StoryScene.NOISE_MAZE:
        setCurrentScene(StoryScene.SANCTUARY);
        break;
      case StoryScene.SANCTUARY:
        setCurrentScene(StoryScene.MEMORY_LANE);
        break;
      case StoryScene.MEMORY_LANE:
        if (selectedMemory || true) { // Always allow continued progression
          setCurrentScene(StoryScene.REFLECTION);
        }
        break;
      case StoryScene.REFLECTION:
        setCurrentScene(StoryScene.AGE_SELECTION);
        break;
      case StoryScene.AGE_SELECTION:
        if (selectedAge) {
          setCurrentScene(StoryScene.READY);
        }
        break;
      case StoryScene.READY:
        // Redirect to sign up or continue to the app
        const journeyQuizSection = document.getElementById("journey-quiz");
        if (journeyQuizSection) {
          journeyQuizSection.scrollIntoView({ behavior: "smooth" });
        }
        break;
    }
  };

  // Get background style based on current scene
  const getSceneBackground = () => {
    switch (currentScene) {
      case StoryScene.INTRO:
        return "bg-black";
      case StoryScene.AVATAR_SELECTION:
        return "bg-gradient-to-b from-gray-900 to-gray-800";
      case StoryScene.NOISE_MAZE:
        return "bg-gradient-to-b from-red-900/80 to-purple-900/80";
      case StoryScene.SANCTUARY:
        return "bg-gradient-to-b from-indigo-900 to-violet-900";
      case StoryScene.MEMORY_LANE:
        return "bg-gradient-to-b from-purple-900 to-blue-900";
      case StoryScene.REFLECTION:
        return "bg-gradient-to-b from-blue-900 to-indigo-900";
      case StoryScene.AGE_SELECTION:
        return "bg-gradient-to-b from-violet-900 to-blue-900";
      case StoryScene.READY:
        return "bg-gradient-to-b from-blue-900 to-teal-900";
      default:
        return "bg-black";
    }
  };

  // Render scene content based on current scene
  const renderSceneContent = () => {
    switch (currentScene) {
      case StoryScene.INTRO:
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
              <span className="text-white">The Day I Lost My</span>{" "}
              <span className="text-blue-400">Voice</span>
            </h1>
            
            <div className="mb-10 text-lg md:text-xl text-white/90 leading-relaxed space-y-4">
              <p>{typedText}</p>
            </div>
            
            <Button
              onClick={continueToNextScene}
              disabled={isTyping}
              className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium animate-pulse"
            >
              Continue
            </Button>
          </motion.div>
        );
        
      case StoryScene.AVATAR_SELECTION:
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center max-w-4xl px-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">{getCurrentText()[0]}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {avatarOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAvatar(option.id)}
                  className={`flex flex-col items-center p-6 rounded-xl transition-all ${
                    selectedAvatar === option.id 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-800/60 text-white/80 hover:bg-gray-700/80"
                  }`}
                >
                  <span className="text-5xl mb-3">{option.emoji}</span>
                  <h3 className="text-lg font-bold mb-1">{option.name}</h3>
                  <p className="text-sm opacity-80">{option.description}</p>
                </motion.button>
              ))}
            </div>
            
            <Button
              onClick={continueToNextScene}
              disabled={!selectedAvatar}
              className={`mt-4 px-8 py-3 rounded-full text-lg ${
                !selectedAvatar 
                  ? "bg-gray-600 cursor-not-allowed" 
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Continue My Journey
            </Button>
          </motion.div>
        );
        
      case StoryScene.NOISE_MAZE:
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">The Maze of Noise</h2>
            
            <div className="mb-10 text-lg md:text-xl text-white/90">
              <p>{typedText}</p>
            </div>
            
            <motion.div 
              className="relative w-32 h-32 mx-auto mb-12"
              animate={{ rotate: 360 }}
              transition={{ ease: "linear", duration: 10, repeat: Infinity }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-5xl">🔊</span>
              </div>
            </motion.div>
            
            <Button
              onClick={continueToNextScene}
              disabled={isTyping}
              className="mt-8 bg-white hover:bg-gray-100 text-purple-900 px-8 py-3 rounded-full text-lg font-medium"
            >
              Find Escape
            </Button>
          </motion.div>
        );
        
      case StoryScene.SANCTUARY:
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center max-w-3xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-32 h-32 mx-auto mb-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
            >
              <span className="text-5xl">🔓</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">The Sanctuary of Unmute</h2>
            
            <div className="mb-10 text-lg md:text-xl text-white/90">
              <p>{typedText}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { emoji: "🎙️", label: "Audio Diaries" },
                { emoji: "🧠", label: "Healing Rooms" },
                { emoji: "🔄", label: "Mentorship" },
                { emoji: "✨", label: "Real Connection" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  className="flex flex-col items-center p-4 rounded-lg bg-white/10"
                >
                  <span className="text-3xl mb-2">{feature.emoji}</span>
                  <span className="text-sm font-medium">{feature.label}</span>
                </motion.div>
              ))}
            </div>
            
            <Button
              onClick={continueToNextScene}
              disabled={isTyping}
              className="mt-4 bg-white hover:bg-gray-100 text-violet-900 px-8 py-3 rounded-full text-lg font-medium"
            >
              Continue
            </Button>
          </motion.div>
        );
        
      case StoryScene.MEMORY_LANE:
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Memory Lane</h2>
            
            <div className="mb-10 text-lg md:text-xl text-white/90">
              <p>{typedText}</p>
            </div>
            
            {!isTyping && (
              <motion.div 
                className="grid grid-cols-1 gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {memoryPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMemory(prompt)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedMemory === prompt 
                        ? "bg-blue-500 text-white" 
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    <p className="font-medium">{prompt}</p>
                  </motion.button>
                ))}
              </motion.div>
            )}
            
            <Button
              onClick={continueToNextScene}
              disabled={isTyping}
              className="mt-4 bg-white hover:bg-gray-100 text-purple-900 px-8 py-3 rounded-full text-lg font-medium"
            >
              Continue
            </Button>
          </motion.div>
        );
        
      case StoryScene.REFLECTION:
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center max-w-2xl"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-8">
              <span className="text-4xl">💭</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">A Moment of Reflection</h2>
            
            <div className="mb-16 text-lg md:text-xl text-white/90 space-y-4">
              <p>{typedText}</p>
            </div>
            
            {selectedMemory && !isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-10 p-4 rounded-lg bg-white/10 backdrop-blur-sm"
              >
                <p className="italic text-white/80">"{selectedMemory}"</p>
              </motion.div>
            )}
            
            <Button
              onClick={continueToNextScene}
              disabled={isTyping}
              className="mt-4 bg-white hover:bg-gray-100 text-indigo-900 px-8 py-3 rounded-full text-lg font-medium"
            >
              I'm Ready to Continue
            </Button>
          </motion.div>
        );
        
      case StoryScene.AGE_SELECTION:
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">{getCurrentText()[0]}</h2>
            <h3 className="text-xl md:text-2xl mb-10 text-white/80">{getCurrentText()[1]}</h3>
            
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {ageGroups.map((age) => (
                <motion.button
                  key={age}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAge(age)}
                  className={`px-6 py-3 rounded-full text-lg ${
                    selectedAge === age
                      ? "bg-blue-500 text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {age}
                </motion.button>
              ))}
            </div>
            
            <Button
              onClick={continueToNextScene}
              disabled={!selectedAge}
              className={`mt-4 px-8 py-3 rounded-full text-lg ${
                !selectedAge
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Continue
            </Button>
          </motion.div>
        );
        
      case StoryScene.READY:
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center max-w-3xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 1 }}
              className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-400 to-teal-300 flex items-center justify-center"
            >
              <span className="text-6xl">🌱</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">You're Ready</h2>
            
            <div className="mb-10 text-lg md:text-xl text-white/90 space-y-4">
              <p>{typedText}</p>
            </div>
            
            <Button
              onClick={continueToNextScene}
              className="mt-8 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white px-12 py-5 rounded-full text-xl font-medium shadow-lg shadow-blue-500/30"
            >
              I'm ready to Unmute
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <section className={`relative min-h-screen overflow-y-auto ${getSceneBackground()}`}>
      {/* Video Background with Gradient Overlay (only visible in the intro) */}
      {currentScene === StoryScene.INTRO && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90 z-10"></div>
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
      )}

      {/* Moving Background Elements for Different Scenes */}
      {currentScene !== StoryScene.INTRO && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Floating particles */}
          {currentScene === StoryScene.NOISE_MAZE && (
            <>
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute bg-white/20 rounded-full"
                  style={{
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0.7, 0.3, 0.7]
                  }}
                  transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
              
              {/* Noise text bubbles */}
              {["Too much", "Not enough", "Be quiet", "Speak up"].map((text, i) => (
                <motion.div
                  key={`noise-${i}`}
                  className="absolute bg-white/10 px-4 py-2 rounded-full text-white/40 text-sm"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: Math.random() * 7 + 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {text}
                </motion.div>
              ))}
            </>
          )}
          
          {/* Sanctuary gentle wave background */}
          {currentScene === StoryScene.SANCTUARY && (
            <div className="absolute inset-0">
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-violet-500/20 to-transparent"
                animate={{
                  y: [0, -20, 0]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          )}
          
          {/* Age portal background elements */}
          {currentScene === StoryScene.AGE_SELECTION && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`circle-${i}`}
                  className="absolute rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-md"
                  style={{
                    width: Math.random() * 200 + 100,
                    height: Math.random() * 200 + 100,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </>
          )}
          
          {/* Ready scene background elements */}
          {currentScene === StoryScene.READY && (
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-teal-500/20 to-blue-500/20"
                animate={{
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              {/* Light beams */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`beam-${i}`}
                  className="absolute w-20 h-[200%] bg-white/10 rotate-45 blur-3xl"
                  style={{
                    left: `${i * 30 + 10}%`,
                    top: '-50%',
                  }}
                  animate={{
                    left: [`${i * 30 + 10}%`, `${i * 30 + 25}%`, `${i * 30 + 10}%`]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-white px-4 py-16 flex items-center justify-center min-h-screen w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center justify-center"
          >
            {renderSceneContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Full interactive story link */}
      {currentScene === StoryScene.READY && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Link to="/story">
            <Button
              className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full hover:bg-white/30 transition-colors"
            >
              Experience the full interactive story
            </Button>
          </Link>
        </motion.div>
      )}
      
      {/* Audio controls */}
      <div className="fixed bottom-8 right-8 z-20 flex items-center space-x-2">
        <button 
          onClick={() => setShowMusicControls(!showMusicControls)}
          className="bg-black/30 backdrop-blur-sm p-3 rounded-full hover:bg-black/50 transition-colors"
        >
          <Music className="h-5 w-5 text-white/80" />
        </button>
        
        <button 
          onClick={toggleMute} 
          className="bg-black/30 backdrop-blur-sm p-3 rounded-full hover:bg-black/50 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white/80" />
          ) : (
            <Volume2 className="h-5 w-5 text-white/80" />
          )}
        </button>
        
        {showMusicControls && currentMusicTrack && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white/80 text-sm flex items-center"
          >
            <span className="mr-2">🎵</span>
            <span>{currentMusicTrack.name}</span>
          </motion.div>
        )}
      </div>
      
      {/* Skip story button */}
      {currentScene !== StoryScene.READY && (
        <button 
          onClick={() => {
            const journeyQuizSection = document.getElementById("journey-quiz");
            if (journeyQuizSection) {
              journeyQuizSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="absolute bottom-8 left-8 z-20 text-sm text-white/60 hover:text-white/90 transition-colors"
        >
          Skip Story
        </button>
      )}
      
      {/* Scene progress indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {Object.values(StoryScene).map((scene, index) => (
            <div 
              key={scene}
              className={`h-1 w-8 rounded ${
                Object.values(StoryScene).indexOf(currentScene as StoryScene) >= index 
                  ? 'bg-white' 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Scroll indicator for mobile devices */}
      <motion.div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden sm:flex flex-col items-center"
        animate={{ opacity: [0.4, 0.8, 0.4], y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="h-5 w-5 text-white/60" />
        <span className="text-xs text-white/60 mt-1">Scroll</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;

