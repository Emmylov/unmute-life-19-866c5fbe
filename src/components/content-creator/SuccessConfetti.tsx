
import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const SuccessConfetti = () => {
  useEffect(() => {
    // Shorter duration so it doesn't block the view for too long
    const duration = 700; // Reduced from 2000ms to 700ms
    const end = Date.now() + duration;

    const colors = ['#7c3aed', '#ec4899', '#fb7185', '#14b8a6'];

    // Create a more subtle confetti burst effect
    (function frame() {
      confetti({
        particleCount: 25, // Reduced particle count
        angle: 60,
        spread: 40, // Reduced spread
        origin: { x: 0, y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1,
        gravity: 1.5, // Increased gravity for faster fall
        decay: 0.9, // Faster decay
      });

      confetti({
        particleCount: 25, // Reduced particle count
        angle: 120,
        spread: 40, // Reduced spread
        origin: { x: 1, y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1,
        gravity: 1.5, // Increased gravity for faster fall
        decay: 0.9, // Faster decay
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Add more subtle confetti sprinkles with a very short timeout
    setTimeout(() => {
      confetti({
        particleCount: 50, // Reduced particle count
        startVelocity: 20,
        spread: 180, // Reduced spread
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        disableForReducedMotion: true,
        gravity: 1.5, // Increased gravity
        decay: 0.9, // Faster decay
      });
    }, 100); // Shorter timeout

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default SuccessConfetti;
