
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatList from "@/components/chat/ChatList";
import MessageBubble from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, MessageSquare, Users, Settings, Menu, Send } from "lucide-react";

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

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
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

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      
      // Optimistically add to UI
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        variant: "destructive",
      });
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

  const getChatPartner = () => {
    if (!chatId) return null;
    return profiles[chatId];
  };

  const chatPartner = getChatPartner();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile chat navigation */}
      {isMobile && chatId && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-30"
          onClick={() => navigate("/chat")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      
      {/* Chat sidebar - hidden on mobile when in a chat */}
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
      
      {/* Main chat area */}
      <div className={`flex-grow flex flex-col ${!chatId && !isMobile ? "items-center justify-center bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10" : ""}`}>
        {!chatId && !isMobile ? (
          <div className="text-center p-8 max-w-md">
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
        ) : chatId ? (
          <>
            {/* Chat header */}
            <ChatHeader
              profile={chatPartner}
              moodStatus={moodStatus}
              setMoodStatus={setMoodStatus}
            />
            
            {/* Chat messages */}
            <div className="flex-grow p-4 overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    isOwn={msg.sender_id === currentUserId}
                    profile={profiles[msg.sender_id]}
                  />
                ))}
                {isTyping && (
                  <TypingIndicator 
                    profile={chatPartner} 
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Chat input */}
            <ChatInput 
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Chat;
