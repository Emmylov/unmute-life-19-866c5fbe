
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarClock, Rocket, ArrowRight, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simple email validation
const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== null;
};

const MaintenanceMode = () => {
  const [email, setEmail] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [countdown, setCountdown] = React.useState({
    days: 3,
    hours: 14,
    minutes: 25,
    seconds: 0,
  });

  useEffect(() => {
    // Set up confetti background
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 w-full h-full pointer-events-none';
    canvas.id = 'maintenance-confetti';
    document.body.appendChild(canvas);

    // Return cleanup function
    return () => {
      document.getElementById('maintenance-confetti')?.remove();
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
      // Here you could send the email to your backend
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2D3748] flex flex-col justify-center items-center px-4 py-10">
      {/* Purple gradient orb */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] opacity-20 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-gradient-to-r from-[#D6BCFA] to-[#9b87f5] opacity-10 blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 max-w-2xl mx-auto text-center"
      >
        <div className="mb-6 inline-block">
          <motion.div 
            className="bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] rounded-full p-3 shadow-glow"
            animate={{ 
              boxShadow: ['0 0 10px rgba(155, 135, 245, 0.3)', '0 0 20px rgba(214, 188, 250, 0.6)', '0 0 10px rgba(155, 135, 245, 0.3)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Rocket className="h-8 w-8 text-white" />
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]">
          Something Huge is Coming to Unmute
        </h1>
        
        <p className="text-xl md:text-2xl mb-6 text-gray-300">
          We're upgrading our platform with exciting new features to enhance your experience.
        </p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center mb-4">
            <CalendarClock className="h-6 w-6 text-[#9b87f5] mr-2" />
            <h2 className="text-xl font-semibold text-white">Expected Return</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4">
            {Object.entries(countdown).map(([unit, value]) => (
              <div key={unit} className="bg-white/5 rounded-lg p-3">
                <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
                <div className="text-xs md:text-sm text-gray-400">{unit.charAt(0).toUpperCase() + unit.slice(1)}</div>
              </div>
            ))}
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
                <h2 className="text-xl font-semibold text-white">Get Notified</h2>
              </div>
              
              <p className="text-gray-300 mb-4">
                Leave your email and we'll let you know the moment we're back online!
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
                We'll send you an update as soon as we're back. Get ready for an improved Unmute experience!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="mt-8 text-sm text-gray-400">
          If you have any questions, reach out to us at support@unmutelife.online
        </p>
      </motion.div>
    </div>
  );
};

export default MaintenanceMode;
