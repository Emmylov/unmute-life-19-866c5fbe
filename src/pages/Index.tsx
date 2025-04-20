
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StarterPackSection from "@/components/waitlist/StarterPackSection";
import TestimonialSection from "@/components/waitlist/TestimonialSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Gift } from "lucide-react";
import useAuthGuard from "@/hooks/use-auth-guard";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const Index = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuthGuard({ 
    redirectIfAuthenticated: true, 
    authenticatedRedirectTo: "/home" 
  });
  
  useEffect(() => {
    // Launch day celebration effect
    const launchConfetti = () => {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const runConfetti = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#9b87f5', '#f59bf1', '#87c9f5']
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#9b87f5', '#f59bf1', '#87c9f5']
        });

        if (Date.now() < end) {
          requestAnimationFrame(runConfetti);
        }
      };
      
      runConfetti();
    };
    
    launchConfetti();
    
    // Show launch toast
    toast.success("We're officially launched! 🎉", {
      description: "Welcome to Unmute - Your space to be heard.",
      duration: 5000,
    });
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
          <div className="inline-block mb-4 px-4 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-unmute-purple border border-unmute-purple/20">
            🎉 We're officially launched!
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="unmute-gradient-text">Your voice matters.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Join the movement. Express yourself authentically. Connect meaningfully.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-unmute-purple hover:bg-unmute-purple/90 text-white px-8 py-6 h-auto text-lg"
              size="lg"
            >
              Get Started Now
            </Button>
            
            <Button 
              onClick={() => navigate('/onboarding')}
              variant="outline"
              className="border-unmute-purple text-unmute-purple hover:bg-unmute-purple/10 px-8 py-6 h-auto text-lg"
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
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Launch Day Special
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Join today and get the exclusive OG Starter Pack with premium features and customizations.
            </p>
            
            <div className="bg-gradient-to-r from-unmute-purple/10 to-unmute-pink/10 p-6 md:p-10 rounded-2xl border border-white/60 mb-16">
              <div className="flex items-center justify-center mb-6">
                <Gift className="h-12 w-12 text-unmute-purple mr-4" />
                <h3 className="text-2xl md:text-3xl font-bold">OG Starter Pack</h3>
              </div>
              <StarterPackSection className="bg-transparent py-0" />
            </div>
          </div>
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
