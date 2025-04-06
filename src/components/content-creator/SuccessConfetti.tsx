
import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const SuccessConfetti = () => {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ['#7c3aed', '#ec4899', '#fb7185', '#14b8a6'];

    // Create a confetti burst effect
    (function frame() {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Add more subtle confetti sprinkles
    setTimeout(() => {
      confetti({
        particleCount: 100,
        startVelocity: 30,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        disableForReducedMotion: true,
      });
    }, 300);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default SuccessConfetti;
