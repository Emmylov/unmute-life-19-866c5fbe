
import { supabase } from "@/integrations/supabase/client";
import { getChatMessages, sendMessage, markMessageAsRead } from "./message-service";

// Get all chat conversations for a user
export const getUserChats = async (userId: string) => {
  try {
    const { data: sentChats, error: sentError } = await supabase
      .from("chat_messages")
      .select("receiver_id")
      .eq("sender_id", userId);
      
    if (sentError) throw sentError;
    
    const { data: receivedChats, error: receivedError } = await supabase
      .from("chat_messages")
      .select("sender_id")
      .eq("receiver_id", userId);
      
    if (receivedError) throw receivedError;
    
    // Get unique user IDs of people the current user has chatted with
    const chatUserIds = [
      ...new Set([
        ...(sentChats || []).map(chat => chat.receiver_id),
        ...(receivedChats || []).map(chat => chat.sender_id)
      ])
    ];
    
    if (chatUserIds.length === 0) {
      return [];
    }
    
    // Get user profiles for each chat partner
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", chatUserIds);
      
    if (profilesError) throw profilesError;
    
    // Get the latest message and unread count for each conversation
    const chatPreviews = await Promise.all(
      chatUserIds.map(async (partnerId) => {
        // Get the latest message
        const { data: latestMessage, error: messageError } = await supabase
          .from("chat_messages")
          .select("*")
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
          
        if (messageError && messageError.code !== 'PGRST116') {
          console.error(`Error getting latest message with ${partnerId}:`, messageError);
        }
        
        // Count unread messages
        const { count: unreadCount, error: countError } = await supabase
          .from("chat_messages")
          .select("*", { count: 'exact', head: true })
          .eq("sender_id", partnerId)
          .eq("receiver_id", userId)
          .eq("read", false);
          
        if (countError) {
          console.error(`Error counting unread messages with ${partnerId}:`, countError);
        }
        
        // Find the partner's profile
        const profile = profiles?.find(p => p.id === partnerId);
        
        return {
          id: partnerId,
          profile,
          latestMessage: latestMessage || null,
          unreadCount: unreadCount || 0,
          lastActivity: latestMessage?.created_at || new Date().toISOString(),
          // Add formatted data for ChatList component
          lastMessage: latestMessage?.content || '',
          timestamp: latestMessage?.created_at || new Date().toISOString(),
          unread: unreadCount || 0
        };
      })
    );
    
    // Sort by most recent activity
    return chatPreviews.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw error;
  }
};

// Set up real-time chat functionality
export const setupChatRealtime = (userId: string, onNewMessage: (message: any) => void) => {
  const channel = supabase
    .channel('chat_messages_channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `receiver_id=eq.${userId}`
      },
      (payload) => {
        onNewMessage(payload.new);
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};

// Mark all messages in a conversation as read
export const markConversationAsRead = async (userId: string, partnerId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .update({ read: true })
      .eq('sender_id', partnerId)
      .eq('receiver_id', userId)
      .eq('read', false);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    throw error;
  }
};

// Check if a user is typing (update typing status)
export const updateTypingStatus = async (userId: string, receiverId: string, isTyping: boolean) => {
  try {
    // Use Supabase Realtime Presence for typing indicators
    const typingChannel = supabase.channel(`typing:${userId}:${receiverId}`);
    
    if (isTyping) {
      await typingChannel.track({
        user: userId,
        isTyping: true,
        timestamp: new Date().toISOString()
      });
    } else {
      await typingChannel.untrack();
    }
    
    return true;
  } catch (error) {
    console.error("Error updating typing status:", error);
    return false;
  }
};

// Subscribe to typing indicators
export const subscribeToTypingIndicator = (userId: string, partnerId: string, onTypingChange: (isTyping: boolean) => void) => {
  const channel = supabase.channel(`typing:${partnerId}:${userId}`);
  
  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const isPartnerTyping = Object.values(state).some((presence: any) => 
        presence.some((p: any) => p.isTyping && p.user === partnerId)
      );
      onTypingChange(isPartnerTyping);
    })
    .on('presence', { event: 'join' }, ({ newPresences }) => {
      const isPartnerTyping = newPresences.some((p: any) => p.isTyping && p.user === partnerId);
      onTypingChange(isPartnerTyping);
    })
    .on('presence', { event: 'leave' }, () => {
      onTypingChange(false);
    })
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};

// Export the imported functions for completeness
export { getChatMessages, sendMessage, markMessageAsRead };
