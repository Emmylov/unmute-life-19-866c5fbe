
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import ChatList from "./ChatList";
import { MessageSquare, Users, Settings } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";

interface ChatSidebarProps {
  isMobile: boolean;
  chatId?: string;
}

const ChatSidebar = ({ isMobile, chatId }: ChatSidebarProps) => {
  const { activeChats, profiles, currentUserId } = useChatContext();
  
  if (isMobile && chatId) {
    return null;
  }

  return (
    <div 
      className={`${
        isMobile && chatId ? "hidden" : "w-full md:w-80 lg:w-96"
      } border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-950`}
    >
      {/* Sidebar header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h2 className="text-xl font-bold unmute-gradient-text">Messages</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Chat list */}
      <ScrollArea className="flex-grow">
        <ChatList 
          chats={activeChats} 
          profiles={profiles}
          currentUserId={currentUserId}
          activeChatId={chatId}
        />
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
