
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthGuard from "@/hooks/use-auth-guard";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { playSound } from "@/utils/sound-effects";
import SEO from "@/components/shared/SEO";
import UnmuteExperience from "@/components/landing/UnmuteExperience";

const Index = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuthGuard({ 
    redirectIfAuthenticated: true, 
    authenticatedRedirectTo: "/home" 
  });
  
  useEffect(() => {
    const hasSeenEffect = sessionStorage.getItem('hasSeenLaunchEffect');
    
    if (!hasSeenEffect) {
      const launchParty = () => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;
        
        const colors = ['#9b87f5', '#f59bf1', '#87c9f5', '#FFD700', '#FF69B4'];

        const runConfetti = () => {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
            shapes: ['circle', 'square'],
            scalar: 2
          });
          
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
            shapes: ['circle', 'square'],
            scalar: 2
          });

          if (Date.now() < end) {
            requestAnimationFrame(runConfetti);
          }
        };
        
        runConfetti();
        
        setTimeout(() => {
          confetti({
            particleCount: 30,
            spread: 100,
            origin: { y: 0.6 },
            colors: colors,
            shapes: ['star'],
            scalar: 2
          });
        }, 500);
        
        playSound('reward', 0.3).catch(() => {});
      };
      
      launchParty();
      sessionStorage.setItem('hasSeenLaunchEffect', 'true');
      
      toast.success(
        "🎉 Launch Party Time!", 
        {
          description: "Join us in celebrating the official launch of Unmute! Get your exclusive OG Pack now.",
          duration: 6000,
          icon: <div className="animate-bounce">🎉</div>
        }
      );
    }
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-unmute-purple rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <>
      <SEO 
        title="Unmute: A Safe Place to Be Loud | Speak your truth, find your community" 
        description="Welcome to Unmute - a safe space to be loud. Express yourself authentically, connect deeply, and find your community. No filters, just real connections."
      />
      
      <UnmuteExperience />
    </>
  );
};

export default Index;
