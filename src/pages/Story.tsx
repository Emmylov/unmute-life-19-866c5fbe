
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
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
    id: 'forest_depths',
    text: "You venture deeper into the forest, the canopy growing thicker above you. The light changes, dappled patterns dancing across the forest floor. There's a sense of ancient magic all around you.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b",
    choices: [
      { text: "Follow a narrow deer path", nextScene: "lakeside" },
      { text: "Climb a tall tree to get your bearings", nextScene: "tree_climb" }
    ]
  },
  {
    id: 'tree_climb',
    text: "From the top branches, you can see the entire forest stretching out before you. To the east lies a glimmering lake, to the west a mountain range, and to the north, curiously, what seems to be a circle of standing stones.",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969",
    choices: [
      { text: "Head toward the lake", nextScene: "lakeside" },
      { text: "Head toward the stone circle", nextScene: "stone_circle" }
    ]
  },
  {
    id: 'stone_circle',
    text: "The ancient stone circle stands solemnly in a perfect clearing. Each stone is covered in symbols that seem to shift when you don't look directly at them. In the center is a small pedestal.",
    image: "https://images.unsplash.com/photo-1564658718110-11737c2d9457",
    choices: [
      { text: "Examine the pedestal", nextScene: "meet_guide" },
      { text: "Leave the circle and head to the lake", nextScene: "lakeside" }
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
    id: 'lakeside_retreat',
    text: "Something about the lake makes you uneasy. As you step back, a gentle breeze ripples across the surface, breaking the perfect mirror. You feel like you've just avoided something... significant.",
    choices: [
      { text: "Reconsider and look into the water", nextScene: "reflection_vision" },
      { text: "Follow the shore around the lake", nextScene: "lake_shore" }
    ]
  },
  {
    id: 'lake_shore',
    text: "Walking along the shore, you find a small boat tied to a weathered dock. It looks seaworthy, with a single oar resting inside.",
    image: "https://images.unsplash.com/photo-1520116468816-95b69f847357",
    choices: [
      { text: "Take the boat onto the lake", nextScene: "boat_journey" },
      { text: "Continue following the shore", nextScene: "mountain_base" }
    ]
  },
  {
    id: 'boat_journey',
    text: "As you row to the center of the lake, the water beneath you begins to glow with an ethereal light. The boat seems to move of its own accord now, guided by unseen currents.",
    image: "https://images.unsplash.com/photo-1439405326854-014607f694d7",
    choices: [
      { text: "Allow the boat to guide you", nextScene: "lake_center" },
      { text: "Try to row back to shore", nextScene: "lakeside" }
    ]
  },
  {
    id: 'lake_center',
    text: "In the center of the lake, time seems to stand still. The water is perfectly clear, and you can see all the way to the bottom, where something is glowing...",
    endScene: true
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
    id: 'mountain_descent',
    text: "You begin your descent, carrying the whispers of the wind with you. The path down is different from the one you took up, leading you through a series of narrow ledges and small caves.",
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99",
    choices: [
      { text: "Explore one of the caves", nextScene: "mountain_cave" },
      { text: "Keep descending toward the valley", nextScene: "valley_approach" }
    ]
  },
  {
    id: 'mountain_cave',
    text: "The cave is surprisingly warm and emits a soft, pulsing light. As your eyes adjust, you see that the walls are covered in luminescent crystals that seem to respond to your presence.",
    image: "https://images.unsplash.com/photo-1496889934714-8724ace33656",
    endScene: true
  },
  {
    id: 'valley_approach',
    text: "The valley below is lush and vibrant, a stark contrast to the rugged mountain. A river winds through it, leading to what looks like a small settlement in the distance.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    endScene: true
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
    id: 'contemplation',
    text: "As you contemplate the vision, the lake seems to respond to your thoughts. The reflection shifts again, showing glimpses of the paths that lie before you—some bright with promise, others shrouded in shadow.",
    choices: [
      { text: "Reach out to touch the water now", nextScene: "touch_reflection" },
      { text: "Move away from the lake with new insight", nextScene: "leave_lake" }
    ]
  },
  {
    id: 'leave_lake',
    text: "Taking a deep breath, you step back from the lake, carrying the vision with you. As you walk away, you feel somehow changed, as if the lake has awakened something within you that was always there but dormant.",
    endScene: true
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
      
      try {
        audioRef.current = new Audio(`/sounds/${currentScene.music}.mp3`);
        audioRef.current.volume = 0.3;
        audioRef.current.loop = true;
        audioRef.current.muted = isMuted;
        audioRef.current.play().catch(err => console.log("Audio playback prevented:", err));
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  }, [currentSceneId, isMuted]);

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
    
    // Play sound effect for choice selection if available
    try {
      const sound = new Audio('/sounds/select.mp3');
      sound.volume = 0.5;
      sound.play().catch(err => console.log("Select sound prevented:", err));
    } catch (error) {
      console.error("Error playing select sound:", error);
    }
    
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
      
      // Play confirmation sound if available
      try {
        const sound = new Audio('/sounds/confirm.mp3');
        sound.volume = 0.5;
        sound.play().catch(err => console.log("Confirm sound prevented:", err));
      } catch (error) {
        console.error("Error playing confirm sound:", error);
      }
      
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
    // Play restart sound if available
    try {
      const sound = new Audio('/sounds/restart.mp3');
      sound.volume = 0.5;
      sound.play().catch(err => console.log("Restart sound prevented:", err));
    } catch (error) {
      console.error("Error playing restart sound:", error);
    }
    
    // Reset state
    setStoryState({
      playerName: '',
      playerChoices: {},
      inventory: [],
      visitedScenes: ['intro']
    });
    setCurrentSceneId('intro');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <AppLayout pageTitle="Interactive Story">
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="relative mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              The Keeper's Journey
            </h1>
            <p className="text-center text-gray-300">An interactive tale of choices and discovery</p>
            
            {/* Inventory display */}
            {storyState.inventory.length > 0 && (
              <div className="mt-4 p-2 bg-white/10 backdrop-blur-sm rounded-md">
                <p className="text-sm text-gray-300">Inventory:</p>
                <div className="flex gap-2 mt-1">
                  {storyState.inventory.map(item => (
                    <span key={item} className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
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
              className="rounded-lg overflow-hidden shadow-2xl bg-black/30 backdrop-blur-sm border border-white/10"
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
                  <p className="text-lg md:text-xl leading-relaxed text-gray-100">
                    {processText(currentScene?.text || 'Your journey continues...')}
                  </p>
                </div>
                
                {/* Input prompt for name entry */}
                {currentScene?.inputPrompt && (
                  <div className="mb-6 mt-4">
                    <label className="block text-sm text-gray-300 mb-2">
                      {currentScene.inputPrompt}:
                    </label>
                    <div className="flex gap-3">
                      <Input
                        value={playerInput}
                        onChange={(e) => setPlayerInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                        placeholder="Enter your name"
                      />
                      <Button 
                        onClick={handleNameSubmit}
                        disabled={!playerInput.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
                          className="w-full flex items-center justify-between px-4 py-6 bg-white/10 hover:bg-indigo-600/50 border border-white/20 hover:border-indigo-500 transition-colors text-left"
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
                    <p className="text-gray-300 mb-4">Your journey has reached a meaningful moment, but there are many more paths to explore.</p>
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
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
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
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
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
              className="mt-3 p-3 bg-white/10 rounded-md text-center text-sm text-gray-300"
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
