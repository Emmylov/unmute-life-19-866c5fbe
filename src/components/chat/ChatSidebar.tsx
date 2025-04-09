
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatList from "./ChatList";
import { MessageSquare, Users, Settings, Search, UserPlus, PlusCircle } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatSidebarProps {
  isMobile: boolean;
  chatId?: string;
}

const ChatSidebar = ({ isMobile, chatId }: ChatSidebarProps) => {
  const { activeChats, profiles, currentUserId } = useChatContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  
  // Hide sidebar on mobile when in a conversation
  if (isMobile && chatId) {
    return null;
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar')
          .or(`username.ilike.%${value}%,full_name.ilike.%${value}%`)
          .limit(5);
        
        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error("Error searching for users:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const startNewChat = async (userId: string) => {
    // Logic to start a new chat with this user would go here
    toast({
      title: "Starting new conversation",
      description: "Opening chat with this user",
      duration: 3000,
    });
    
    // You would typically:
    // 1. Check if a chat already exists
    // 2. Create a new chat if it doesn't
    // 3. Navigate to that chat
    
    // For now, we'll just close the search
    setSearchTerm("");
    setSearchResults([]);
  };

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
          <Button variant="ghost" size="icon" aria-label="New message">
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="People">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Search users */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for users..." 
            className="pl-10 bg-gray-50 border-none focus-visible:ring-unmute-purple/30"
          />
        </div>
        
        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="mt-2 bg-white rounded-md border border-gray-200 shadow-sm">
            {searchResults.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => startNewChat(user.id)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-unmute-purple text-white">
                    {user.username?.charAt(0).toUpperCase() || user.full_name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="font-medium text-sm">{user.full_name || user.username}</p>
                  {user.username && <p className="text-xs text-gray-500">@{user.username}</p>}
                </div>
                <Button size="sm" variant="ghost" className="ml-2">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {isSearching && (
          <div className="mt-2 text-center p-2 text-sm text-gray-500">
            Searching...
          </div>
        )}
        
        {searchTerm.length >= 2 && searchResults.length === 0 && !isSearching && (
          <div className="mt-2 text-center p-2 text-sm text-gray-500">
            No users found
          </div>
        )}
      </div>
      
      {/* Chat list */}
      <ScrollArea className="flex-grow">
        {activeChats.length === 0 ? (
          <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-40">
            <UserPlus className="h-10 w-10 mb-2 text-unmute-purple/50" />
            <p className="font-medium">Start a conversation</p>
            <p className="text-sm mt-2">Search for people to chat with</p>
          </div>
        ) : (
          <ChatList 
            chats={activeChats} 
            profiles={profiles}
            currentUserId={currentUserId}
            activeChatId={chatId}
          />
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
