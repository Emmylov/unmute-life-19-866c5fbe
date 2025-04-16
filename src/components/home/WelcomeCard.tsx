
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeCardProps {
  profile: any;
}

const WelcomeCard = ({ profile }: WelcomeCardProps) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="bg-dream-mist rounded-xl p-4 shadow-sm border border-white/40"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="font-semibold text-lg mb-2">Welcome to Unmute!</h3>
      <p className="text-sm text-gray-600 mb-3">
        This is your feed. Discover voices that matter to you.
      </p>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="rounded-full text-primary border-primary/20"
          onClick={() => navigate("/explore")}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Explore
        </Button>
        <Button 
          size="sm" 
          className="bg-cosmic-crush hover:bg-cosmic-crush/90 rounded-full text-white"
          onClick={() => navigate("/profile")}
        >
          Complete Profile
        </Button>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;
