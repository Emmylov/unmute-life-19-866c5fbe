
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarClock, ArrowRight, BellRing, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Simple email validation
const validateEmail = (email: string): boolean => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== null;
};

const MaintenanceMode = () => {
  const [email, setEmail] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  useEffect(() => {
    // Set up confetti background
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 w-full h-full pointer-events-none';
    canvas.id = 'maintenance-confetti';
    document.body.appendChild(canvas);

    // Enable scrolling on the body
    document.body.style.overflow = 'auto';
    
    // Return cleanup function
    return () => {
      document.getElementById('maintenance-confetti')?.remove();
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    // Update the validity state based on email validation
    setIsValid(validateEmail(email));
  }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setIsSubmitted(true);
      toast({
        title: "Thanks for subscribing!",
        description: "We'll notify you when development resumes.",
      });
      // Here you could send the email to your backend
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2D3748] flex flex-col justify-center items-center px-4 py-10 maintenance-mode overflow-y-auto">
      {/* Purple gradient orbs */}
      <div className="fixed top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] opacity-20 blur-3xl" />
      <div className="fixed bottom-20 left-20 w-72 h-72 rounded-full bg-gradient-to-r from-[#D6BCFA] to-[#9b87f5] opacity-10 blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 max-w-2xl mx-auto text-center my-8"
      >
        <div className="mb-6 inline-block">
          <motion.div 
            className="bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] rounded-full p-3 shadow-glow"
            animate={{ 
              boxShadow: ['0 0 10px rgba(155, 135, 245, 0.3)', '0 0 20px rgba(214, 188, 250, 0.6)', '0 0 10px rgba(155, 135, 245, 0.3)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BookOpen className="h-8 w-8 text-white" />
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]">
          I'm Taking a Study Break
        </h1>
        
        <p className="text-xl md:text-2xl mb-6 text-gray-300">
          Development is paused while I focus on school commitments.
        </p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center mb-4">
            <CalendarClock className="h-6 w-6 text-[#9b87f5] mr-2" />
            <h2 className="text-xl font-semibold text-white">When Will Development Resume?</h2>
          </div>
          
          <p className="text-gray-300 mb-2">
            App development is currently paused while I focus on school priorities. I don't have a specific return date, but I'm excited to continue building when time allows.
          </p>
          
          <div className="mt-4 bg-white/5 rounded-lg p-4">
            <p className="text-white font-medium">
              "Education is my priority right now, but Unmute will return with even better features when I'm back!"
            </p>
          </div>
        </div>
        
        <AnimatePresence>
          {!isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center mb-4">
                <BellRing className="h-6 w-6 text-[#9b87f5] mr-2" />
                <h2 className="text-xl font-semibold text-white">Get Notified When I'm Back</h2>
              </div>
              
              <p className="text-gray-300 mb-4">
                Leave your email and I'll let you know when development resumes!
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9b87f5]"
                />
                <Button 
                  type="submit"
                  disabled={!isValid}
                  className="bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Notify Me <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#9b87f5]/20 backdrop-blur-md rounded-2xl p-6 border border-[#9b87f5]/40"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
              <p className="text-gray-300">
                I'll send you an update when development resumes. Thanks for your patience and support!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="mt-8 text-sm text-gray-400">
          If you have any questions, reach out to me at support@unmutelife.online
        </p>
      </motion.div>
    </div>
  );
};

export default MaintenanceMode;
