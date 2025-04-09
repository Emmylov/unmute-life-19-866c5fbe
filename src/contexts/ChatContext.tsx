
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
}

interface Profile {
  id: string;
  username: string;
  avatar: string;
  full_name?: string;
}

interface ChatContextType {
  messages: Message[];
  profiles: Record<string, Profile>;
  currentUserId: string | null;
  activeChats: any[];
  loading: boolean;
  isTyping: boolean;
  message: string;
  setMessage: (message: string) => void;
  moodStatus: string;
  setMoodStatus: (status: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  fetchChats: (userId: string) => Promise<void>;
  fetchProfiles: (userIds: string[]) => Promise<void>;
  getChatPartner: () => Profile | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode; chatId?: string }> = ({ 
  children,
  chatId 
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [moodStatus, setMoodStatus] = useState<string>("chill");

  // Check authenticated user
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate("/auth");
        return;
      }
      
      setCurrentUserId(data.session.user.id);
      fetchChats(data.session.user.id);
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch user's active conversations
  const fetchChats = async (userId: string) => {
    setLoading(true);
    try {
      // Get messages where user is either sender or receiver
      const { data: sentMessages, error: sentError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("sender_id", userId)
        .order("created_at", { ascending: false });
      
      const { data: receivedMessages, error: receivedError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("receiver_id", userId)
        .order("created_at", { ascending: false });
      
      if (sentError || receivedError) throw new Error("Error fetching messages");
      
      // Combine and get unique conversations
      const allMessages = [...(sentMessages || []), ...(receivedMessages || [])];
      const uniqueChats = new Map();
      
      for (const msg of allMessages) {
        const chatPartnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (!uniqueChats.has(chatPartnerId)) {
          uniqueChats.set(chatPartnerId, {
            id: chatPartnerId,
            lastMessage: msg.content,
            timestamp: msg.created_at,
            unread: msg.receiver_id === userId && !msg.read ? 1 : 0
          });
        }
      }
      
      // Fetch profiles for all chat partners
      const chatPartnerIds = Array.from(uniqueChats.keys());
      await fetchProfiles(chatPartnerIds);
      
      setActiveChats(Array.from(uniqueChats.values()));
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast({
        title: "Failed to load chats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for specific chat
  useEffect(() => {
    if (!chatId || !currentUserId) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // Get messages between current user and chat partner
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .or(`sender_id.eq.${chatId},receiver_id.eq.${chatId}`)
          .order("created_at", { ascending: true });
        
        if (error) throw error;
        
        // Filter to only include messages between these two users
        const filteredMessages = data.filter(msg => 
          (msg.sender_id === currentUserId && msg.receiver_id === chatId) || 
          (msg.sender_id === chatId && msg.receiver_id === currentUserId)
        );
        
        setMessages(filteredMessages);
        
        // Mark received messages as read
        const unreadMsgIds = filteredMessages
          .filter(msg => msg.receiver_id === currentUserId && !msg.read)
          .map(msg => msg.id);
        
        if (unreadMsgIds.length > 0) {
          await supabase
            .from("chat_messages")
            .update({ read: true })
            .in("id", unreadMsgIds);
        }
        
        // Fetch profile for chat partner
        await fetchProfiles([chatId]);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscriptions
    const channel = supabase
      .channel('chat-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `sender_id=eq.${chatId},receiver_id=eq.${currentUserId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
          // Mark new message as read
          supabase
            .from("chat_messages")
            .update({ read: true })
            .eq("id", payload.new.id);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, currentUserId, toast]);

  // Fetch profiles for users
  const fetchProfiles = async (userIds: string[]) => {
    if (!userIds.length) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar, full_name")
        .in("id", userIds);
      
      if (error) throw error;
      
      const profileMap: Record<string, Profile> = {};
      data.forEach(profile => {
        profileMap[profile.id] = profile;
      });
      
      setProfiles(prev => ({ ...prev, ...profileMap }));
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  // Simulate typing indicator for demo
  useEffect(() => {
    if (message && Math.random() > 0.7) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !chatId || !currentUserId) return;
    
    try {
      const newMessage = {
        sender_id: currentUserId,
        receiver_id: chatId,
        content: message,
        read: false
      };
      
      const { error } = await supabase
        .from("chat_messages")
        .insert(newMessage);
      
      if (error) throw error;
      
      // Optimistically clear the input
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getChatPartner = () => {
    if (!chatId) return null;
    return profiles[chatId];
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        profiles,
        currentUserId,
        activeChats,
        loading,
        isTyping,
        message,
        setMessage,
        moodStatus,
        setMoodStatus,
        handleSendMessage,
        fetchChats,
        fetchProfiles,
        getChatPartner
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
