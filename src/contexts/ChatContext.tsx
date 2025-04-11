
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { 
  getUserChats, 
  getChatMessages, 
  sendMessage, 
  markMessageAsRead, 
  markConversationAsRead, 
  setupChatRealtime,
  updateTypingStatus,
  subscribeToTypingIndicator
} from "@/services/chat-service";

interface ChatContextType {
  messages: any[];
  chats: any[];
  currentChatId: string | null;
  loading: boolean;
  sending: boolean;
  currentUserId: string;
  message: string;
  profiles: Record<string, any>;
  moodStatus: string;
  isTyping: boolean;
  setMessage: (message: string) => void;
  setMoodStatus: (status: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  getChatPartner: () => any;
  fetchMessages: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  chats: [],
  currentChatId: null,
  loading: false,
  sending: false,
  currentUserId: "",
  message: "",
  profiles: {},
  moodStatus: "😊",
  isTyping: false,
  setMessage: () => {},
  setMoodStatus: () => {},
  handleSendMessage: () => {},
  getChatPartner: () => null,
  fetchMessages: async () => {}
});

interface ChatProviderProps {
  children: React.ReactNode;
  chatId?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, chatId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [moodStatus, setMoodStatus] = useState<string>("😊");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { user, profile } = useAuth();

  // Fetch user chats
  const fetchChats = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const chatList = await getUserChats(user.id);
      setChats(chatList);
      
      // Build profiles object
      const profilesMap: Record<string, any> = {};
      chatList.forEach(chat => {
        if (chat.profile) {
          profilesMap[chat.id] = chat.profile;
        }
      });
      
      setProfiles(prevProfiles => ({
        ...prevProfiles,
        ...profilesMap
      }));
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chats");
    }
  }, [user?.id]);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    if (!user?.id || !currentChatId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const messagesData = await getChatMessages(user.id, currentChatId);
      setMessages(messagesData || []);
      
      // Mark conversation as read
      await markConversationAsRead(user.id, currentChatId);
      
      // Update chat list to reflect read messages
      fetchChats();
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [user?.id, currentChatId, fetchChats]);

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user?.id || !currentChatId) return;
    
    setSending(true);
    
    try {
      const newMessage = await sendMessage(user.id, currentChatId, message);
      
      // Add message to local state for immediate feedback
      setMessages(prev => [...prev, newMessage]);
      
      // Clear message input
      setMessage("");
      
      // Update chat list
      fetchChats();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Handle typing indicator
  const handleTyping = useCallback((isTyping: boolean) => {
    if (!user?.id || !currentChatId) return;
    
    updateTypingStatus(user.id, currentChatId, isTyping);
  }, [user?.id, currentChatId]);

  // Get the chat partner's profile
  const getChatPartner = useCallback(() => {
    if (!currentChatId) return null;
    return profiles[currentChatId] || null;
  }, [currentChatId, profiles]);

  // Set up real-time message updates
  useEffect(() => {
    if (!user?.id) return;
    
    const cleanup = setupChatRealtime(user.id, (newMessage) => {
      // Only update if this is for the current chat
      if (newMessage.sender_id === currentChatId || newMessage.receiver_id === currentChatId) {
        setMessages(prev => [...prev, newMessage]);
        
        // Mark as read if we're in the chat
        markMessageAsRead(newMessage.id);
      }
      
      // Update chat list regardless
      fetchChats();
      
      // Show notification if the message is not in the current chat
      if (newMessage.sender_id !== currentChatId) {
        const sender = profiles[newMessage.sender_id];
        toast.info(
          `New message from ${sender?.username || 'Someone'}`,
          {
            description: newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? '...' : '')
          }
        );
      }
    });
    
    return cleanup;
  }, [user?.id, currentChatId, profiles, fetchChats]);

  // Subscribe to typing indicators
  useEffect(() => {
    if (!user?.id || !currentChatId) return;
    
    const cleanup = subscribeToTypingIndicator(
      user.id,
      currentChatId,
      setIsTyping
    );
    
    return cleanup;
  }, [user?.id, currentChatId]);

  // Watch for message input changes to trigger typing indicator
  useEffect(() => {
    if (!message.trim()) {
      handleTyping(false);
      return;
    }
    
    const timeout = setTimeout(() => {
      handleTyping(true);
    }, 300);
    
    return () => {
      clearTimeout(timeout);
      handleTyping(false);
    };
  }, [message, handleTyping]);

  // Load initial chats
  useEffect(() => {
    if (user?.id) {
      fetchChats();
    }
  }, [user?.id, fetchChats]);

  // Load messages when currentChatId changes
  useEffect(() => {
    if (chatId && chatId !== currentChatId) {
      setCurrentChatId(chatId);
    }
    
    if (user?.id && currentChatId) {
      fetchMessages();
    }
  }, [user?.id, currentChatId, chatId, fetchMessages]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        chats,
        currentChatId,
        loading,
        sending,
        currentUserId: user?.id || "",
        message,
        profiles,
        moodStatus,
        isTyping,
        setMessage,
        setMoodStatus,
        handleSendMessage,
        getChatPartner,
        fetchMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
