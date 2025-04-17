
import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface MessagesButtonProps {
  unreadMessages: number;
}

const MessagesButton = ({ unreadMessages }: MessagesButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`relative text-gray-500 hover:text-unmute-purple transition-colors h-6 w-6 ${location.pathname.includes('/chat') ? 'bg-unmute-purple/10 text-unmute-purple' : ''}`}
      onClick={() => navigate('/chat')}
    >
      <MessageSquare className="h-3 w-3" />
      {unreadMessages > 0 && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-unmute-pink text-white text-[10px] flex items-center justify-center font-medium">
          {unreadMessages > 9 ? '9+' : unreadMessages}
        </span>
      )}
      <span className="sr-only">Messages</span>
    </Button>
  );
};

export default MessagesButton;
