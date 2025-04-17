
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const LaunchBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState<string | null>(null);
  const { user } = useAuth();
  
  const launchDate = new Date("2025-04-18T00:00:00");
  const now = new Date();
  
  // Set banner visibility based on user preferences
  useEffect(() => {
    const checkBannerPreference = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('user_settings')
          .select('settings')
          .eq('user_id', user.id)
          .single();
          
        // Safely access nested properties to avoid type errors
        if (data?.settings && typeof data.settings === 'object') {
          const settings = data.settings as Record<string, any>;
          if (settings.launch && typeof settings.launch === 'object' && settings.launch.hideBanner) {
            setIsVisible(false);
          }
        }
      } catch (error) {
        console.error("Error checking banner preferences:", error);
      }
    };
    
    checkBannerPreference();
  }, [user]);
  
  // Calculate countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      
      if (now >= launchDate) {
        // Launch has happened
        const daysSinceLaunch = Math.floor((now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLaunch === 0) {
          setCountdown("Today is launch day! 🎉");
        } else if (daysSinceLaunch === 1) {
          setCountdown("Launched yesterday! 🎉");
        } else if (daysSinceLaunch <= 7) {
          setCountdown(`Launched ${daysSinceLaunch} days ago! 🎉`);
        } else {
          // More than a week since launch, hide banner
          setIsVisible(false);
        }
        return;
      }
      
      // Launch is still upcoming
      const diff = launchDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setCountdown(`Launching in ${days}d ${hours}h`);
      } else if (hours > 0) {
        setCountdown(`Launching in ${hours}h ${minutes}m`);
      } else {
        setCountdown(`Launching in ${minutes}m`);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const dismissBanner = async () => {
    if (user) {
      // Save user preference
      try {
        const { data } = await supabase
          .from('user_settings')
          .select('settings, id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (data) {
          const currentSettings = typeof data.settings === 'object' ? data.settings : {};
          
          await supabase
            .from('user_settings')
            .update({
              settings: {
                ...currentSettings,
                launch: {
                  ...(currentSettings && typeof currentSettings === 'object' && 
                      currentSettings.launch && typeof currentSettings.launch === 'object' 
                      ? currentSettings.launch : {}),
                  hideBanner: true
                }
              }
            })
            .eq('id', data.id);
        } else {
          await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              settings: {
                launch: {
                  hideBanner: true
                }
              }
            });
        }
      } catch (error) {
        console.error("Error saving banner preference:", error);
      }
    }
    
    setIsVisible(false);
  };
  
  if (!isVisible || !countdown) return null;
  
  const isLaunchDay = now >= launchDate && now <= new Date(launchDate.getTime() + 24 * 60 * 60 * 1000);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-unmute-purple/20 to-unmute-pink/20 backdrop-blur-sm p-3 rounded-lg mb-6 relative shadow-sm"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6 rounded-full"
        onClick={dismissBanner}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Dismiss</span>
      </Button>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-3 py-1">
        {isLaunchDay ? (
          <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
        ) : (
          <Gift className="h-5 w-5 text-unmute-purple animate-pulse" />
        )}
        
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium">
            {isLaunchDay 
              ? "Unmute has officially launched! 🎉 Join now to get exclusive rewards!" 
              : countdown
            }
          </p>
          {isLaunchDay && (
            <p className="text-xs text-muted-foreground">
              Early adopters get special perks for joining during launch week.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LaunchBanner;
