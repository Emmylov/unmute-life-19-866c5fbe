
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { getChatMessages, markMessageAsRead } from "@/services/content-service";
import { getUserChats, setupChatRealtime, sendMessage } from "@/services/chat-service";

interface ChatContextType {
  messages: Record<string, any[]>;
  loadingMessages: boolean;
  profiles: Record<string, any>;
  loadingProfiles: boolean;
  activeChats: any[];
  isTyping: Record<string, boolean>;
  currentUserId: string | null;
  refreshMessages: (chatId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  markConversationAsRead: (partnerId: string) => Promise<void>;
  setTypingStatus: (partnerId: string, isTyping: boolean) => void;
  refreshChats: () => Promise<void>;
  // Add missing properties
  getChatPartner: () => any;
  moodStatus: string;
  setMoodStatus: (status: string) => void;
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

const ChatContext = createContext<ChatContextType>({
  messages: {},
  loadingMessages: false,
  profiles: {},
  loadingProfiles: false,
  activeChats: [],
  isTyping: {},
  currentUserId: null,
  refreshMessages: async () => {},
  markAsRead: async () => {},
  markConversationAsRead: async () => {},
  setTypingStatus: () => {},
  refreshChats: async () => {},
  // Add missing properties to default context
  getChatPartner: () => null,
  moodStatus: 'chill',
  setMoodStatus: () => {},
  message: '',
  setMessage: () => {},
  handleSendMessage: () => {},
});

interface ChatProviderProps {
  children: React.ReactNode;
  chatId?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ 
  children,
  chatId 
}) => {
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  
  // Add new state variables
  const [moodStatus, setMoodStatus] = useState('chill');
  const [message, setMessage] = useState('');

  // Initialize chat data
  useEffect(() => {
    if (user) {
      fetchChats();
      
      // Set up realtime subscription for new messages
      const cleanup = setupChatRealtime(user.id, (newMessage) => {
        // Update messages for the relevant chat
        setMessages(prev => {
          const chatId = newMessage.sender_id;
          const updatedMessages = { ...prev };
          
          if (updatedMessages[chatId]) {
            updatedMessages[chatId] = [...updatedMessages[chatId], newMessage];
          } else {
            updatedMessages[chatId] = [newMessage];
          }
          
          return updatedMessages;
        });
        
        // Refresh chats list to update previews
        fetchChats();
      });
      
      return () => {
        cleanup();
      };
    }
  }, [user]);

  // Add effect to load messages when chatId changes
  useEffect(() => {
    if (chatId && user) {
      refreshMessages(chatId);
    }
  }, [chatId, user]);

  const fetchChats = async () => {
    if (!user) return;
    
    try {
      setLoadingProfiles(true);
      const chats = await getUserChats(user.id);
      setActiveChats(chats);
      
      // Update profiles
      const profilesMap: Record<string, any> = {};
      chats.forEach(chat => {
        if (chat.profile) {
          profilesMap[chat.id] = chat.profile;
        }
      });
      
      setProfiles(profilesMap);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const refreshMessages = async (partnerId: string) => {
    if (!user || !partnerId) return;
    
    try {
      setLoadingMessages(true);
      const chatMessages = await getChatMessages(user.id, partnerId);
      setMessages(prev => ({
        ...prev,
        [partnerId]: chatMessages
      }));
    } catch (error) {
      console.error("Error refreshing messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const markConversationAsRead = async (partnerId: string) => {
    if (!user) return;
    
    try {
      await fetch(`/api/chats/${user.id}/read/${partnerId}`, { 
        method: 'POST'
      });
      
      // Refresh chats to update unread counts
      fetchChats();
    } catch (error) {
      console.error("Error marking conversation as read:", error);
    }
  };

  const setTypingStatus = (partnerId: string, isTyping: boolean) => {
    setIsTyping(prev => ({
      ...prev,
      [partnerId]: isTyping
    }));
  };

  // Get chat partner profile function
  const getChatPartner = () => {
    if (!chatId || !profiles) return null;
    return profiles[chatId] || null;
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user || !chatId) return;
    
    try {
      await sendMessage(user.id, chatId, message);
      setMessage('');
      // Refresh messages after sending
      await refreshMessages(chatId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loadingMessages,
        profiles,
        loadingProfiles,
        activeChats,
        isTyping,
        currentUserId: user?.id || null,
        refreshMessages,
        markAsRead,
        markConversationAsRead,
        setTypingStatus,
        refreshChats: fetchChats,
        // Add new properties
        getChatPartner,
        moodStatus,
        setMoodStatus,
        message,
        setMessage,
        handleSendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
