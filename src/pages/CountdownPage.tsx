
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Headphones, FileText, Phone, Gift, Clock, Users, ArrowDown } from "lucide-react";
import CountdownTimer from "@/components/countdown/CountdownTimer";
import TestimonialSlider from "@/components/countdown/TestimonialSlider";
import { supabase } from "@/integrations/supabase/client";

const CountdownPage = () => {
  // Launch date - set to 30 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to waitlist table - using the typed client
      const { error } = await supabase
        .from('waitlist')
        .insert({ email, name });
      
      if (error) throw error;
      
      toast.success("You've been added to the waitlist! Welcome to Unmute!");
      setEmail("");
      setName("");
      
      // Show confetti animation
      const confettiEl = document.createElement('div');
      confettiEl.className = 'confetti-animation';
      document.body.appendChild(confettiEl);
      
      setTimeout(() => {
        document.body.removeChild(confettiEl);
      }, 3000);
      
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'dark' : ''}`}>
      <div className="relative flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Dark/Light mode toggle */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-secondary/50 backdrop-blur-sm"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <motion.div 
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-lg">☀️</span>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ rotate: 90 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-lg">🌙</span>
              </motion.div>
            )}
          </button>
        </div>

        {/* Hero section with countdown */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-unmute-purple/10 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-unmute-pink/10 blur-3xl"></div>
          </div>
          
          {/* Main content */}
          <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="unmute-gradient-text">Unmute</span> Is Launching Soon!
              </h1>
              
              <p className="text-xl md:text-2xl mb-12 text-muted-foreground">
                Join the movement. Be one of the first. Get the OG Starter Pack.
              </p>
              
              <div className="mb-16">
                <CountdownTimer targetDate={launchDate} />
              </div>
            </motion.div>
            
            {/* Registration form */}
            <motion.div 
              className="glass-card rounded-2xl p-6 md:p-8 mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6">Reserve Your Spot</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    type="text"
                    placeholder="Your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="unmute-primary-button w-full py-6 text-lg mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding you..." : "Unmute Me"}
                </Button>
              </form>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="hidden md:flex justify-center"
            >
              <ArrowDown className="text-muted-foreground/70" />
            </motion.div>
          </div>
        </section>
        
        {/* OG Starter Pack section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              <span className="unmute-gradient-text">OG Starter Pack</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                className="glass-card p-6 rounded-xl text-center"
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-unmute-purple/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-unmute-purple" />
                </div>
                <h3 className="font-bold text-lg mb-2">Exclusive Wallpaper</h3>
                <p className="text-muted-foreground">Beautiful phone wallpapers designed by our artists</p>
              </motion.div>
              
              <motion.div 
                className="glass-card p-6 rounded-xl text-center"
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-unmute-pink/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-unmute-pink" />
                </div>
                <h3 className="font-bold text-lg mb-2">Mini Ebook</h3>
                <p className="text-muted-foreground">Digital wellness guide with expert tips</p>
              </motion.div>
              
              <motion.div 
                className="glass-card p-6 rounded-xl text-center"
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-unmute-purple/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Headphones className="text-unmute-purple" />
                </div>
                <h3 className="font-bold text-lg mb-2">Curated Playlist</h3>
                <p className="text-muted-foreground">Calming sounds to boost your wellbeing</p>
              </motion.div>
              
              <motion.div 
                className="glass-card p-6 rounded-xl text-center"
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-unmute-pink/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Gift className="text-unmute-pink" />
                </div>
                <h3 className="font-bold text-lg mb-2">Challenge Card</h3>
                <p className="text-muted-foreground">30-day mental wellness challenge</p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Wall of Voices section */}
        <section className="py-20 px-4 bg-gradient-to-br from-unmute-purple/5 to-unmute-pink/5">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-12">
              <Users className="h-12 w-12 mx-auto text-unmute-purple mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Wall of Voices</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everyone who signs up before launch gets featured on our OG wall & gets a special in-app badge.
              </p>
            </div>
            
            <div className="relative h-40 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-card py-3 px-6 rounded-full animate-pulse-slow">
                  <p className="text-sm md:text-base font-medium">Be the first to join our OG community!</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="unmute-gradient-text">What People Are Saying</span>
            </h2>
            
            <TestimonialSlider />
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                <span className="unmute-gradient-text">Unmute</span>
              </h2>
              <p className="text-muted-foreground">Your voice, amplified.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-unmute-purple transition-colors">
                About
              </Link>
              <Link to="/" className="hover:text-unmute-purple transition-colors">
                Contact
              </Link>
              <Link to="/" className="hover:text-unmute-purple transition-colors">
                Privacy Policy
              </Link>
            </div>
            
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Unmute. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CountdownPage;
