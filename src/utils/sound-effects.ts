
// Sound effects utility for playing various app sounds

// Define sound effect types for better type safety
export type SoundEffectType = 
  | 'notification' 
  | 'success' 
  | 'error' 
  | 'click' 
  | 'complete'
  | 'reward'
  | 'achievement';

// Map of sound effect types to their file paths
const soundEffects: Record<SoundEffectType, string> = {
  notification: '/notification-sound.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  click: '/sounds/click.mp3',
  complete: '/sounds/complete.mp3',
  reward: '/notification-sound.mp3', // Reusing existing sound
  achievement: '/sounds/achievement.mp3',
};

// Volume settings (0-1)
const defaultVolume = 0.5;

/**
 * Play a sound effect
 * @param type The type of sound effect to play
 * @param volume Optional volume override (0-1)
 * @returns Promise that resolves when the sound is played or rejects on error
 */
export const playSound = (type: SoundEffectType, volume?: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const sound = new Audio(soundEffects[type]);
      sound.volume = volume !== undefined ? Math.min(Math.max(volume, 0), 1) : defaultVolume;
      
      sound.onended = () => {
        resolve();
      };
      
      sound.onerror = (error) => {
        console.error(`Error playing sound ${type}:`, error);
        reject(error);
      };
      
      sound.play().catch(error => {
        console.error(`Browser blocked autoplay for ${type}:`, error);
        reject(error);
      });
    } catch (error) {
      console.error(`Could not play sound ${type}:`, error);
      reject(error);
    }
  });
};

/**
 * Check if user has interacted with the page (needed for autoplay)
 */
export const hasUserInteracted = (): boolean => {
  return document.documentElement.hasAttribute('data-user-interacted');
};

/**
 * Set up user interaction detection
 */
export const setupSoundInteractionDetection = (): void => {
  if (typeof document === 'undefined') return;

  const markUserInteraction = () => {
    document.documentElement.setAttribute('data-user-interacted', 'true');
    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.removeEventListener(event, markUserInteraction);
    });
  };

  ['click', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, markUserInteraction);
  });
};

// Initialize user interaction detection
if (typeof document !== 'undefined') {
  setupSoundInteractionDetection();
}
