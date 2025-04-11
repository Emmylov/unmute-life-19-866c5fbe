
import { supabase } from "@/integrations/supabase/client";

// Chat Functions
export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  try {
    // Create the message
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
        read: false
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .update({ read: true })
      .eq("id", messageId)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

export const getChatMessages = async (userId: string, partnerId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error getting chat messages:", error);
    throw error;
  }
};

export const getChatList = async (userId: string) => {
  try {
    // This is a more complex query that needs to get all users the current user has chatted with
    const { data: sentMessages, error: sentError } = await supabase
      .from('chat_messages')
      .select('receiver_id')
      .eq('sender_id', userId);
    
    if (sentError) throw sentError;
    
    const { data: receivedMessages, error: receivedError } = await supabase
      .from('chat_messages')
      .select('sender_id')
      .eq('receiver_id', userId);
    
    if (receivedError) throw receivedError;
    
    // Combine unique user IDs
    const chatPartnerIds = [
      ...new Set([
        ...sentMessages.map(msg => msg.receiver_id),
        ...receivedMessages.map(msg => msg.sender_id)
      ])
    ];
    
    if (chatPartnerIds.length === 0) {
      return [];
    }
    
    // Get profile information for all chat partners
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', chatPartnerIds);
    
    if (profilesError) throw profilesError;
    
    // Get the latest message for each chat
    const chatPreviews = await Promise.all(
      chatPartnerIds.map(async (partnerId) => {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          console.error(`Error getting latest message with ${partnerId}:`, error);
          return null;
        }
        
        const profile = profiles?.find(p => p.id === partnerId);
        
        return {
          partnerId,
          profile,
          latestMessage: data,
          unreadCount: 0 // We'll calculate this separately
        };
      })
    );
    
    // Filter out null results
    const validChatPreviews = chatPreviews.filter(preview => preview !== null);
    
    // Calculate unread messages for each chat
    await Promise.all(
      validChatPreviews.map(async (preview) => {
        if (!preview) return;
        
        const { data, error } = await supabase
          .from('chat_messages')
          .select('id')
          .eq('sender_id', preview.partnerId)
          .eq('receiver_id', userId)
          .eq('read', false);
        
        if (!error) {
          preview.unreadCount = data?.length || 0;
        }
      })
    );
    
    // Sort by latest message timestamp
    return validChatPreviews.sort((a, b) => {
      if (!a || !b || !a.latestMessage || !b.latestMessage) return 0;
      return new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime();
    });
  } catch (error) {
    console.error("Error getting chat list:", error);
    throw error;
  }
};
