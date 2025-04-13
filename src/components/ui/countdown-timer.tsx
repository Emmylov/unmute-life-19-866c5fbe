
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-responsive";
import { Clock, Gift, BookOpen, Music, Award } from "lucide-react";

interface CountdownTimerProps {
  targetDate: Date;
  endMessage?: string;
  className?: string;
  showIcon?: boolean;
}

export function CountdownTimer({ 
  targetDate, 
  endMessage = "It's here!", 
  className = "", 
  showIcon = true
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isComplete, setIsComplete] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference <= 0) {
        setIsComplete(true);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };
    
    // Initial calculation
    calculateTimeLeft();
    
    // Don't set up the interval if already complete
    if (isComplete) {
      return;
    }
    
    // Set up interval
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clean up
    return () => clearInterval(timer);
  }, [targetDate, isComplete]);
  
  if (isComplete) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-lg font-medium">{endMessage}</p>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {showIcon && (
        <Clock className="h-6 w-6 mb-2 text-primary animate-pulse" />
      )}
      
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'}`}>
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        {isMobile && <div className="col-span-2" />}
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
  // Ensure the value is always displayed with two digits
  const displayValue = value < 10 ? `0${value}` : value.toString();
  
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-b from-primary/10 to-primary/30 rounded-xl px-4 py-3 min-w-20 text-center shadow-lg transition-all duration-300 transform hover:scale-105">
        <span className="text-3xl font-bold text-primary">{displayValue}</span>
      </div>
      <span className="text-sm text-gray-600 mt-2 font-medium">{label}</span>
    </div>
  );
}
