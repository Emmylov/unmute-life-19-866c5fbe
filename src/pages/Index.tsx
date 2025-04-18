
import React from "react";
import { Link } from "react-router-dom";
import WaitlistSignupForm from "@/components/waitlist/WaitlistSignupForm";
import StarterPackSection from "@/components/waitlist/StarterPackSection";
import TestimonialSection from "@/components/waitlist/TestimonialSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import useAuthGuard from "@/hooks/use-auth-guard";

const Index = () => {
  const { isLoading } = useAuthGuard({ 
    redirectIfAuthenticated: true, 
    authenticatedRedirectTo: "/home" 
  });
  
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
        <section className="max-w-6xl mx-auto px-6 py-8 md:py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="unmute-gradient-text">Welcome to Unmute!</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-2xl mx-auto">
            Join the movement. Be one of the first. Get the OG Starter Pack.
          </p>

          <div className="flex flex-col items-center gap-4 mb-12">
            <WaitlistSignupForm className="max-w-md mx-auto" />
            
            <div className="text-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center text-unmute-purple hover:text-unmute-purple/80 font-medium"
              >
                Early access user? Sign in here <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        
        <StarterPackSection />
        
        <section className="py-12 bg-gradient-to-b from-white/0 to-unmute-purple/10">
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
