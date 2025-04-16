
import React from "react";
import { motion } from "framer-motion";
import { Smile, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import WelcomeCard from "./WelcomeCard";
import SuggestedUsers from "./SuggestedUsers";
import TrendingTopics from "./TrendingTopics";

interface HomeRightSidebarProps {
  profile: any;
}

const HomeRightSidebar = ({ profile }: HomeRightSidebarProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="hidden lg:flex lg:flex-col space-y-4">
      <WelcomeCard profile={profile} />
      <SuggestedUsers />
      <TrendingTopics />

      {/* Vibe Check Card */}
      <motion.div
        className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 shadow-sm border border-white/40"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Smile className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Daily Vibe Check</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Take a moment to reflect on how you're feeling today. Track your mood, energy, and peace.
        </p>
        <Button 
          className="w-full bg-dream-mist hover:bg-dream-mist/90 text-primary font-medium"
          onClick={() => navigate("/vibe-check")}
        >
          Check Your Vibe
        </Button>
      </motion.div>
      
      {/* Unmute Collabs Card */}
      <motion.div
        className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-4 shadow-sm border border-white/40"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-cosmic-crush/10">
            <Users className="h-5 w-5 text-cosmic-crush" />
          </div>
          <h3 className="font-semibold text-lg">Unmute Collabs</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Create content together with friends, artists, or advocates. Share your combined voices!
        </p>
        <Button 
          className="w-full bg-cosmic-crush/20 hover:bg-cosmic-crush/30 text-cosmic-crush font-medium"
          onClick={() => navigate("/create-collab")}
        >
          Start a Collab
        </Button>
      </motion.div>
    </div>
  );
};

export default HomeRightSidebar;
