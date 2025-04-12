
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Function to add leading zeros
  const padWithZero = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  // Animation variants for the flip animation
  const flipVariants = {
    initial: { rotateX: 0 },
    animate: { rotateX: 360, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {/* Days */}
        <div className="flex flex-col items-center">
          <motion.div
            key={`days-${timeLeft.days}`}
            className="w-full aspect-square bg-gradient-to-br from-unmute-purple to-unmute-pink/80 rounded-xl shadow-lg flex items-center justify-center text-white mb-2"
            initial="initial"
            animate="animate"
            variants={flipVariants}
          >
            <span className="text-2xl md:text-4xl font-bold">{padWithZero(timeLeft.days)}</span>
          </motion.div>
          <span className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground">Days</span>
        </div>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <motion.div
            key={`hours-${timeLeft.hours}`}
            className="w-full aspect-square bg-gradient-to-br from-unmute-purple to-unmute-pink/80 rounded-xl shadow-lg flex items-center justify-center text-white mb-2"
            initial="initial"
            animate="animate"
            variants={flipVariants}
          >
            <span className="text-2xl md:text-4xl font-bold">{padWithZero(timeLeft.hours)}</span>
          </motion.div>
          <span className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground">Hours</span>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <motion.div
            key={`minutes-${timeLeft.minutes}`}
            className="w-full aspect-square bg-gradient-to-br from-unmute-purple to-unmute-pink/80 rounded-xl shadow-lg flex items-center justify-center text-white mb-2"
            initial="initial"
            animate="animate"
            variants={flipVariants}
          >
            <span className="text-2xl md:text-4xl font-bold">{padWithZero(timeLeft.minutes)}</span>
          </motion.div>
          <span className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground">Minutes</span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <motion.div
            key={`seconds-${timeLeft.seconds}`}
            className="w-full aspect-square bg-gradient-to-br from-unmute-purple to-unmute-pink/80 rounded-xl shadow-lg flex items-center justify-center text-white mb-2"
            initial="initial"
            animate="animate"
            variants={flipVariants}
          >
            <span className="text-2xl md:text-4xl font-bold">{padWithZero(timeLeft.seconds)}</span>
          </motion.div>
          <span className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
