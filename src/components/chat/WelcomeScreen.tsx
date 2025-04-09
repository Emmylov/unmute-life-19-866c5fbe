
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center p-8 max-w-md mx-auto">
      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-unmute-purple/40" />
      <h3 className="text-2xl font-bold mb-2">Start chatting</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Select a conversation or start a new one to begin messaging
      </p>
      <Button 
        className="unmute-primary-button"
        onClick={() => navigate("/explore")}
      >
        Find people to chat with
      </Button>
    </div>
  );
};

export default WelcomeScreen;
