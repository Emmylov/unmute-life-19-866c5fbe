
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Profile {
  id: string;
  username: string;
  avatar: string;
  full_name?: string;
}

interface TypingIndicatorProps {
  profile: Profile | null;
}

const TypingIndicator = ({ profile }: TypingIndicatorProps) => {
  return (
    <div className="flex items-start mt-2 animate-fade-in">
      <Avatar className="h-8 w-8 mr-2">
        <AvatarImage src={profile?.avatar} />
        <AvatarFallback className="bg-unmute-blue text-white">
          {profile?.username?.charAt(0).toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="py-2 px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
      <span className="text-xs text-gray-500 ml-2 mt-2">
        {profile?.username || "Someone"} is typing...
      </span>
    </div>
  );
};

export default TypingIndicator;
