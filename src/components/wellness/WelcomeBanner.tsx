
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayCircle } from 'lucide-react';
import { CountdownTimer } from "@/components/ui/countdown-timer";

const WelcomeBanner = () => {
  const playAudio = () => {
    // Audio functionality would go here
    console.log("Playing welcome audio");
  };
  
  // Set the launch date to April 18, 2025
  const launchDate = new Date("2025-04-18T00:00:00");
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#E5DEFF] to-[#FDE1D3] p-8 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Hi, I'm Chioma Iyayi
          </h1>
          <p className="text-lg text-slate-700">
            Here to help you find healing, purpose, and etiquette that empowers.
          </p>
          <div className="flex items-center space-x-4">
            <Button className="bg-[#9b87f5] hover:bg-[#7E69AB]">
              Book a Session
            </Button>
            <button 
              onClick={playAudio}
              className="flex items-center text-slate-700 hover:text-[#9b87f5] transition-colors"
            >
              <PlayCircle className="h-6 w-6 mr-2" />
              <span>Listen to intro</span>
            </button>
          </div>
          
          {/* Countdown Timer */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mt-4">
            <h3 className="text-sm font-semibold mb-2">Full Launch Coming:</h3>
            <CountdownTimer 
              targetDate={launchDate} 
              showIcon={false}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative w-60 h-60 md:w-80 md:h-80 overflow-hidden rounded-full border-4 border-white shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000"
              alt="Chioma Iyayi"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#FDE1D3] opacity-60 z-0"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#E5DEFF] opacity-60 z-0"></div>
    </div>
  );
};

export default WelcomeBanner;
