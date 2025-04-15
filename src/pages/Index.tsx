
import React from "react";
import { Link } from "react-router-dom";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import WaitlistSignupForm from "@/components/waitlist/WaitlistSignupForm";
import StarterPackSection from "@/components/waitlist/StarterPackSection";
import TestimonialSection from "@/components/waitlist/TestimonialSection";
import useAuthGuard from "@/hooks/use-auth-guard";

const Index = () => {
  const { isLoading } = useAuthGuard({ 
    redirectIfAuthenticated: true, 
    authenticatedRedirectTo: "/home" 
  });
  
  const launchDate = new Date("2025-04-18T00:00:00");
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-unmute-purple rounded-full border-t-transparent"></div>
    </div>
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10">
      <header className="w-full py-6 px-6 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">
          <span className="unmute-gradient-text">Unmute</span>
        </h1>
        
        <div className="space-x-4">
          <Link to="/auth" className="text-sm font-medium px-4 py-2 rounded-lg bg-white/80 hover:bg-white transition-colors">
            Sign In
          </Link>
          <Link to="/onboarding" className="text-sm text-gray-600 hover:text-unmute-purple">
            Learn More
          </Link>
        </div>
      </header>
      
      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="unmute-gradient-text">Unmute Is Launching Soon!</span>
          </h1>
          
          <div className="max-w-lg mx-auto mb-12">
            <CountdownTimer targetDate={launchDate} className="transform scale-110" />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join the movement. Be one of the first. Get the OG Starter Pack.
          </p>
          
          <WaitlistSignupForm className="max-w-md mx-auto mb-16" />
        </section>
        
        <StarterPackSection />
        
        <section className="py-16 bg-gradient-to-b from-white/0 to-unmute-purple/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <TestimonialSection />
          </div>
        </section>
      </main>
      
      <footer className="bg-white/80 py-8 border-t border-gray-100">
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
