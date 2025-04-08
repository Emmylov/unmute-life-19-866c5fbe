
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Profile {
  id: string;
  username: string;
  avatar: string;
  full_name?: string;
}

interface Chat {
  id: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface ChatListProps {
  chats: Chat[];
  profiles: Record<string, Profile>;
  currentUserId: string | null;
  activeChatId?: string;
}

const ChatList = ({ chats, profiles, currentUserId, activeChatId }: ChatListProps) => {
  if (chats.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No conversations yet.</p>
        <p className="text-sm mt-2">Start chatting with someone!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {chats.map((chat) => {
        const profile = profiles[chat.id];
        const isActive = activeChatId === chat.id;
        
        return (
          <Link
            key={chat.id}
            to={`/chat/${chat.id}`}
            className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              isActive ? "bg-gray-100 dark:bg-gray-800" : ""
            }`}
          >
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={profile?.avatar} />
              <AvatarFallback className="bg-unmute-purple text-white">
                {profile?.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium truncate">
                  {profile?.full_name || profile?.username || "Unknown User"}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {chat.timestamp && formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {chat.lastMessage}
              </p>
            </div>
            
            {chat.unread > 0 && (
              <Badge className="ml-2 bg-unmute-pink">
                {chat.unread}
              </Badge>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default ChatList;
