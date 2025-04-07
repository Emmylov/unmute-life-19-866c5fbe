
import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const SuccessConfetti = () => {
  useEffect(() => {
    // Very short duration so it doesn't block the view
    const duration = 200; // Reduced from 400ms to 200ms for even faster effect
    const end = Date.now() + duration;

    const colors = ['#7c3aed', '#ec4899', '#fb7185', '#14b8a6'];

    // Create a subtle confetti burst effect
    (function frame() {
      confetti({
        particleCount: 8, // Reduced particle count further
        angle: 60,
        spread: 20, // Reduced spread
        origin: { x: 0, y: 0.6 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 0.7, // Reduced size
        gravity: 3, // Increased gravity for faster fall
        decay: 0.75, // Faster decay
      });

      confetti({
        particleCount: 8, // Reduced particle count
        angle: 120,
        spread: 20, // Reduced spread
        origin: { x: 1, y: 0.6 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 0.7, // Reduced size
        gravity: 3, // Increased gravity for faster fall
        decay: 0.75, // Faster decay
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Just a few sprinkles from center with even shorter timeout
    setTimeout(() => {
      confetti({
        particleCount: 12, // Reduced particle count
        startVelocity: 15,
        spread: 80, // Reduced spread
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        disableForReducedMotion: true,
        gravity: 3, // Increased gravity
        decay: 0.75, // Faster decay
      });
    }, 20); // Shorter timeout

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default SuccessConfetti;
