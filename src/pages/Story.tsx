
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, playMusic } from '@/utils/sound-effects';
import { useSound } from '@/contexts/SoundContext';
import { Volume2, VolumeX, ArrowRight, RotateCcw, Music } from 'lucide-react';

// Story types
interface Choice {
  text: string;
  nextScene: string;
  effect?: string;
}

interface Scene {
  id: string;
  text: string;
  image?: string;
  music?: string;
  choices?: Choice[];
  inputPrompt?: string;
  autoProgress?: boolean;
  endScene?: boolean;
}

interface StoryState {
  playerName: string;
  playerChoices: Record<string, string>;
  inventory: string[];
  visitedScenes: string[];
}

const STORY_DATA: Scene[] = [
  {
    id: 'intro',
    text: "Welcome to your journey. Before we begin, what is your name?",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
    music: "ambient-sound",
    inputPrompt: "Enter your name to begin the journey",
    autoProgress: true
  },
  {
    id: 'beginning',
    text: "{playerName}, you find yourself standing at the edge of an ancient forest. The trees whisper secrets as a cool breeze touches your face. What do you do?",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    choices: [
      { text: "Enter the forest", nextScene: "forest_path" },
      { text: "Look for another way around", nextScene: "mountain_trail" }
    ]
  },
  {
    id: 'forest_path',
    text: "The forest welcomes you with dappled sunlight filtering through the canopy. As you walk deeper, you hear a melody carried by the wind. It feels both familiar and strange.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    music: "forest-melody",
    choices: [
      { text: "Follow the melody", nextScene: "enchanted_clearing" },
      { text: "Ignore it and continue on your path", nextScene: "forest_depths" }
    ]
  },
  {
    id: 'mountain_trail',
    text: "You decide to take the mountain trail that circles around the forest. The climb is challenging, but the view from above is breathtaking. You can see the entire forest and a glimmering lake beyond.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    music: "mountain-winds",
    choices: [
      { text: "Descend toward the lake", nextScene: "lakeside" },
      { text: "Continue along the ridge", nextScene: "mountain_peak" }
    ]
  },
  {
    id: 'enchanted_clearing',
    text: "Following the melody leads you to a sun-dappled clearing. In the center stands a figure playing a strange instrument. They stop when they see you. 'Ah, {playerName}, I've been waiting for you,' they say. How do you know your name?",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", 
    music: "enchanted-music",
    choices: [
      { text: "Ask who they are", nextScene: "meet_guide" },
      { text: "Turn and run", nextScene: "forest_depths" }
    ]
  },
  {
    id: 'meet_guide',
    text: "'I am the Keeper of Stories,' they say with a gentle smile. 'Every journey that passes through this forest becomes part of the great tapestry I weave. Your thread has been anticipated for some time, {playerName}.' They offer you a small wooden flute. 'This might help you on your journey.'",
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    music: "keeper-theme",
    choices: [
      { text: "Accept the flute", nextScene: "accept_gift", effect: "ADD_FLUTE" },
      { text: "Politely decline", nextScene: "decline_gift" }
    ]
  },
  {
    id: 'accept_gift',
    text: "You accept the flute, feeling its warm wood against your palm. 'The flute will help you call for guidance when you're lost,' the Keeper explains. 'Now, where will your journey take you next?'",
    choices: [
      { text: "Ask about the lake beyond the forest", nextScene: "learn_about_lake" },
      { text: "Ask about the mountain peak", nextScene: "learn_about_peak" }
    ]
  },
  {
    id: 'decline_gift',
    text: "The Keeper nods understandingly. 'Not all gifts are meant for all travelers. You'll find your own way, {playerName}.' They gesture to the paths ahead. 'Where will your journey take you next?'",
    choices: [
      { text: "Ask about the lake beyond the forest", nextScene: "learn_about_lake" },
      { text: "Ask about the mountain peak", nextScene: "learn_about_peak" }
    ]
  },
  {
    id: 'learn_about_lake',
    text: "'The Lake of Reflection shows each visitor something different,' the Keeper says. 'Some see their past, others their future. Most importantly, it shows what you need to see, not always what you want to see.'",
    choices: [
      { text: "Thank the Keeper and head toward the lake", nextScene: "lakeside" },
      { text: "Ask about the mountain peak instead", nextScene: "learn_about_peak" }
    ]
  },
  {
    id: 'learn_about_peak',
    text: "'The Summit of Whispers is where the winds carry messages from distant lands,' the Keeper explains. 'Those who listen carefully may hear answers to questions they haven't even asked yet.'",
    choices: [
      { text: "Thank the Keeper and head toward the mountain peak", nextScene: "mountain_peak" },
      { text: "Ask about the lake instead", nextScene: "learn_about_lake" }
    ]
  },
  {
    id: 'lakeside',
    text: "You arrive at the shores of a vast, perfectly still lake. The surface is like a mirror, reflecting the sky so perfectly it's hard to tell where one ends and the other begins. As you approach the water's edge, you see your reflection begin to change...",
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    music: "lakeside-reflection",
    choices: [
      { text: "Look closer into the water", nextScene: "reflection_vision" },
      { text: "Step back from the lake", nextScene: "lakeside_retreat" }
    ]
  },
  {
    id: 'mountain_peak',
    text: "After a challenging climb, you reach the Summit of Whispers. The wind here has a voice—or rather, many voices—whispering words that seem just beyond comprehension. As you close your eyes and focus, one message becomes clear...",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    music: "summit-winds",
    choices: [
      { text: "Listen more deeply to the winds", nextScene: "wind_message" },
      { text: "Begin the descent", nextScene: "mountain_descent" }
    ]
  },
  {
    id: 'reflection_vision',
    text: "Your reflection ripples and transforms, showing not who you are now, but who you might become. You see yourself standing tall, confident, having overcome challenges you haven't yet faced. The vision fills you with both anticipation and apprehension.",
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    choices: [
      { text: "Reach out to touch the water", nextScene: "touch_reflection" },
      { text: "Take a moment to reflect on the vision", nextScene: "contemplation" }
    ]
  },
  {
    id: 'wind_message',
    text: "The winds whisper tales of ancient wisdom and future possibilities. They speak of choices yet unmade and paths yet untraveled. Among the many voices, you hear a warning about a shadow growing in the heart of the world.",
    choices: [
      { text: "Ask the winds for guidance", nextScene: "wind_guidance" },
      { text: "Begin the descent with this new knowledge", nextScene: "mountain_descent" }
    ]
  },
  {
    id: 'touch_reflection',
    text: "As your fingers touch the water, the lake's surface glows with an ethereal light. A voice speaks in your mind: 'The path ahead has many branches, {playerName}. Your journey is your own to create.'",
    music: "revelation",
    choices: [
      { text: "Ask the lake for more guidance", nextScene: "lake_guidance" },
      { text: "Leave the lakeside with this insight", nextScene: "leave_lake" }
    ]
  },
  {
    id: 'lake_guidance',
    text: "'Trust yourself, {playerName},' the lake whispers. 'The answers you seek are not found but created through your choices and actions. Your heart knows the way.'",
    endScene: true
  },
  {
    id: 'wind_guidance',
    text: "The winds swirl around you, forming a momentary shape like a pointing hand. They seem to guide you toward a hidden path on the mountain's far side—one that neither descends to the known lands nor climbs higher, but winds its way through uncharted territory.",
    endScene: true
  }
];

const StoryPage: React.FC = () => {
  const [currentSceneId, setCurrentSceneId] = useState<string>('intro');
  const [storyState, setStoryState] = useState<StoryState>({
    playerName: '',
    playerChoices: {},
    inventory: [],
    visitedScenes: ['intro']
  });
  const [playerInput, setPlayerInput] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showMusicControls, setShowMusicControls] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const { playEffect } = useSound();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentScene = STORY_DATA.find(scene => scene.id === currentSceneId);
  
  // Initialize audio when component mounts
  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Change music when scene changes
  useEffect(() => {
    if (!currentScene) return;
    
    if (currentScene.music && !isMuted) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = playMusic(`/sounds/${currentScene.music}.mp3`, 0.3);
      audioRef.current.muted = isMuted;
    }
    
    // Play sound effect on scene change
    playEffect('scene-change');
  }, [currentSceneId, isMuted, playEffect]);

  const handleChoiceSelect = (choice: Choice) => {
    // Record the choice
    setStoryState(prev => ({
      ...prev,
      playerChoices: {
        ...prev.playerChoices,
        [currentSceneId]: choice.text
      },
      visitedScenes: [...prev.visitedScenes, choice.nextScene],
      inventory: choice.effect === 'ADD_FLUTE' ? [...prev.inventory, 'Wooden Flute'] : prev.inventory
    }));

    // Play choice sound
    playEffect('select');
    
    // Move to next scene
    setCurrentSceneId(choice.nextScene);
  };

  const handleNameSubmit = () => {
    if (playerInput.trim()) {
      setStoryState(prev => ({
        ...prev,
        playerName: playerInput.trim(),
        visitedScenes: [...prev.visitedScenes, 'beginning']
      }));
      
      // Play effect
      playEffect('confirm');
      
      // Move to first real scene
      setCurrentSceneId('beginning');
      setPlayerInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentScene?.inputPrompt && playerInput) {
      handleNameSubmit();
    }
  };

  const processText = (text: string): string => {
    let processedText = text;
    
    // Replace player name
    processedText = processedText.replace(/\{playerName\}/g, storyState.playerName || 'Traveler');
    
    return processedText;
  };

  const restartStory = () => {
    // Play restart sound
    playEffect('restart');
    
    // Reset state
    setStoryState({
      playerName: '',
      playerChoices: {},
      inventory: [],
      visitedScenes: ['intro']
    });
    setCurrentSceneId('intro');
    setGameOver(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <AppLayout pageTitle="Interactive Story">
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="relative mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              The Keeper's Journey
            </h1>
            <p className="text-center text-gray-400">An interactive tale of choices and discovery</p>
            
            {/* Inventory display */}
            {storyState.inventory.length > 0 && (
              <div className="mt-4 p-2 bg-gray-800/50 rounded-md">
                <p className="text-sm text-gray-400">Inventory:</p>
                <div className="flex gap-2 mt-1">
                  {storyState.inventory.map(item => (
                    <span key={item} className="px-2 py-1 bg-gray-700/50 rounded text-xs font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSceneId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg overflow-hidden shadow-2xl bg-gray-800/50 backdrop-blur-sm"
            >
              {/* Scene image */}
              {currentScene?.image && (
                <div className="h-64 md:h-80 overflow-hidden">
                  <img 
                    src={currentScene.image} 
                    alt="Story scene" 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              )}
              
              {/* Scene content */}
              <div className="p-6 md:p-8">
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-lg md:text-xl leading-relaxed">
                    {processText(currentScene?.text || 'Your journey continues...')}
                  </p>
                </div>
                
                {/* Input prompt for name entry */}
                {currentScene?.inputPrompt && (
                  <div className="mb-6 mt-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      {currentScene.inputPrompt}:
                    </label>
                    <div className="flex gap-3">
                      <Input
                        value={playerInput}
                        onChange={(e) => setPlayerInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="Enter your name"
                      />
                      <Button 
                        onClick={handleNameSubmit}
                        disabled={!playerInput.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Choices */}
                {currentScene?.choices && (
                  <div className="space-y-3 mt-6">
                    <h3 className="text-sm uppercase text-gray-400 tracking-wider mb-3">What will you do?</h3>
                    <div className="space-y-3">
                      {currentScene.choices.map((choice, index) => (
                        <Button
                          key={index}
                          onClick={() => handleChoiceSelect(choice)}
                          className="w-full flex items-center justify-between px-4 py-6 bg-gray-700/50 hover:bg-blue-600/50 border border-gray-600 hover:border-blue-500 transition-colors"
                          variant="outline"
                        >
                          <span>{choice.text}</span>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* End scene */}
                {currentScene?.endScene && (
                  <div className="mt-8 text-center">
                    <p className="text-gray-400 mb-4">Your journey has reached a meaningful moment, but there are many more paths to explore.</p>
                    <Button 
                      onClick={restartStory}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Begin a New Journey
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Audio controls */}
          <div className="mt-6 flex justify-center space-x-3">
            <button 
              onClick={toggleMute}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            
            <button 
              onClick={() => setShowMusicControls(!showMusicControls)}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors"
              aria-label="Music information"
            >
              <Music className="h-5 w-5" />
            </button>
          </div>
          
          {/* Music info */}
          {showMusicControls && currentScene?.music && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-gray-800/50 rounded-md text-center text-sm text-gray-400"
            >
              Now playing: {currentScene.music.replace(/-/g, ' ')}
              <div className="text-xs mt-1">Music changes as your story unfolds</div>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default StoryPage;
