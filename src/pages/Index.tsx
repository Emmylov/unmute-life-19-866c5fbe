
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StarterPackSection from "@/components/waitlist/StarterPackSection";
import TestimonialSection from "@/components/waitlist/TestimonialSection";
import { Button } from "@/components/ui/button";
import { PartyPopper, Sparkles, ChevronDown, Gift } from "lucide-react";
import useAuthGuard from "@/hooks/use-auth-guard";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { playSound } from "@/utils/sound-effects";

const Index = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuthGuard({ 
    redirectIfAuthenticated: true, 
    authenticatedRedirectTo: "/home" 
  });
  
  useEffect(() => {
    // Launch party celebration effects
    const launchParty = () => {
      const duration = 5 * 1000;
      const end = Date.now() + duration;
      
      const colors = ['#9b87f5', '#f59bf1', '#87c9f5', '#FFD700', '#FF69B4'];

      const runConfetti = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          shapes: ['circle', 'square'],
          scalar: 2
        });
        
        confetti({
          particleCount: 3,
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
      
      // Add some celebratory sprinkles from the middle
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { y: 0.6 },
          colors: colors,
          shapes: ['star'],
          scalar: 2
        });
      }, 500);
      
      // Try to play celebration sound
      playSound('reward', 0.3).catch(() => {
        // Silently fail if sound can't play
      });
    };
    
    launchParty();
    
    // Show launch party toast
    toast.success(
      "🎉 Launch Party Time!", 
      {
        description: "Join us in celebrating the official launch of Unmute! Get your exclusive OG Pack now.",
        duration: 6000,
        icon: <PartyPopper className="text-yellow-400 animate-bounce" />
      }
    );
  }, []);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-unmute-purple rounded-full border-t-transparent"></div>
    </div>
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10">
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">
          <span className="unmute-gradient-text">Unmute</span>
        </h1>
        
        <div className="flex items-center space-x-4">
          <Link to="/auth" className="text-sm text-gray-600 hover:text-unmute-purple">
            Sign In
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col">
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 backdrop-blur-sm rounded-full text-lg font-medium text-unmute-purple border border-yellow-400/30 animate-pulse">
            <PartyPopper className="w-6 h-6 text-yellow-400" />
            Launch Party Now Live!
            <Sparkles className="w-6 h-6 text-pink-400" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="unmute-gradient-text">Your voice matters.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Join the celebration. Express yourself authentically. Connect meaningfully.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-unmute-purple to-unmute-pink hover:opacity-90 text-white px-8 py-6 h-auto text-lg group transition-all duration-300 animate-pulse"
              size="lg"
            >
              <Gift className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              Join the Party Now
            </Button>
            
            <Button 
              onClick={() => navigate('/onboarding')}
              variant="outline"
              className="border-2 border-unmute-purple text-unmute-purple hover:bg-unmute-purple/10 px-8 py-6 h-auto text-lg"
              size="lg"
            >
              Take the Tour
            </Button>
          </div>
          
          <div className="mt-16 flex justify-center">
            <ChevronDown className="w-10 h-10 text-unmute-purple/70 animate-bounce" />
          </div>
        </section>
        
        <section className="py-16 bg-white/30 backdrop-blur-sm">
          <StarterPackSection className="bg-transparent py-0" />
        </section>
        
        <section className="py-16 bg-gradient-to-b from-white/0 to-unmute-purple/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <TestimonialSection />
          </div>
        </section>
      </main>
      
      <footer className="bg-white/80 py-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl font-bold">
                <span className="unmute-gradient-text">Unmute</span>
              </h1>
              <p className="text-sm text-gray-500">© 2025 Unmute. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <Link to="/onboarding" className="text-gray-600 hover:text-unmute-purple">About</Link>
              <Link to="/help" className="text-gray-600 hover:text-unmute-purple">Contact</Link>
              <Link to="#" className="text-gray-600 hover:text-unmute-purple">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
