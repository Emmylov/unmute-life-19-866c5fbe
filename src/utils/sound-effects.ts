
// Simple utility to play sound effects

// Define sound effect types
export type SoundEffectType = string;

// Track user interaction
let userHasInteracted = false;

/**
 * Check if the user has interacted with the page
 * @returns Boolean indicating if user has interacted
 */
export const hasUserInteracted = (): boolean => {
  return userHasInteracted;
};

/**
 * Set up detection for user interaction with the page
 */
export const setupSoundInteractionDetection = (): void => {
  const interactionEvents = ['click', 'touchstart', 'keydown'];
  
  const handleInteraction = () => {
    userHasInteracted = true;
    // Once interaction is detected, we can remove the listeners
    interactionEvents.forEach(event => {
      document.removeEventListener(event, handleInteraction);
    });
  };
  
  // Add listeners for common interaction events
  interactionEvents.forEach(event => {
    document.addEventListener(event, handleInteraction);
  });
};

/**
 * Play a sound effect with the given volume
 * @param soundName Name of the sound file without extension
 * @param volume Volume level between 0 and 1
 * @returns Promise that resolves when the sound is loaded
 */
export const playSound = (soundName: SoundEffectType, volume = 0.5): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create audio element
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.volume = volume;
      
      // Set event handlers
      audio.oncanplaythrough = () => {
        audio.play()
          .then(resolve)
          .catch(err => {
            console.warn(`Sound playback was prevented for ${soundName}: ${err.message}`);
            resolve(); // Resolve anyway to avoid breaking the app flow
          });
      };
      
      audio.onerror = (err) => {
        console.error(`Error loading sound ${soundName}:`, err);
        resolve(); // Resolve anyway to avoid breaking the app flow
      };
    } catch (error) {
      console.error("Error playing sound:", error);
      resolve(); // Resolve anyway to avoid breaking the app flow
    }
  });
};

/**
 * Play a music track with looping
 * @param trackPath Path to the music file
 * @param volume Volume level between 0 and 1
 * @returns Audio element that can be controlled
 */
export const playMusic = (trackPath: string, volume = 0.3): HTMLAudioElement => {
  const audio = new Audio(trackPath);
  audio.loop = true;
  audio.volume = volume;
  
  // Try to play the audio
  audio.play().catch(err => {
    console.warn(`Music playback was prevented: ${err.message}`);
  });
  
  return audio;
};
