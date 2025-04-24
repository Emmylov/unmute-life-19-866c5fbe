
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const WelcomeGreeting = () => {
  const { user, profile } = useAuth();
  const [greeting, setGreeting] = useState("Welcome back!");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour < 12) {
        return "Good morning";
      } else if (hour < 18) {
        return "Good afternoon";
      } else {
        return "Good evening";
      }
    };
    
    const personalizedGreeting = () => {
      const timeGreeting = getTimeBasedGreeting();
      const name = profile?.full_name?.split(' ')[0] || profile?.username || '';
      
      if (name) {
        return `${timeGreeting}, ${name}!`;
      } else {
        return `${timeGreeting}!`;
      }
    };
    
    setGreeting(personalizedGreeting());
    setLoading(false);
  }, [profile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      {loading ? (
        <div className="h-8 flex items-center">
          <div className="text-sm text-gray-500">Loading welcome message...</div>
        </div>
      ) : (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-none shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {greeting}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              What would you like to share today?
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default WelcomeGreeting;
