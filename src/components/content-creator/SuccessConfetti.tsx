
import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const SuccessConfetti = () => {
  useEffect(() => {
    // Very short duration so it doesn't block the view
    const duration = 400; // Reduced from 700ms to 400ms
    const end = Date.now() + duration;

    const colors = ['#7c3aed', '#ec4899', '#fb7185', '#14b8a6'];

    // Create a more subtle confetti burst effect
    (function frame() {
      confetti({
        particleCount: 15, // Reduced particle count further
        angle: 60,
        spread: 30, // Reduced spread
        origin: { x: 0, y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 0.8, // Reduced size
        gravity: 2, // Increased gravity for faster fall
        decay: 0.85, // Faster decay
      });

      confetti({
        particleCount: 15, // Reduced particle count
        angle: 120,
        spread: 30, // Reduced spread
        origin: { x: 1, y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 0.8, // Reduced size
        gravity: 2, // Increased gravity for faster fall
        decay: 0.85, // Faster decay
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Add more subtle confetti sprinkles with a very short timeout
    setTimeout(() => {
      confetti({
        particleCount: 25, // Reduced particle count
        startVelocity: 15,
        spread: 120, // Reduced spread
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        disableForReducedMotion: true,
        gravity: 2, // Increased gravity
        decay: 0.85, // Faster decay
      });
    }, 50); // Shorter timeout

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default SuccessConfetti;
