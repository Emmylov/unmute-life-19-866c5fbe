
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
    
    return data || [];
  } catch (error) {
    console.error("Error getting chat messages:", error);
    throw error;
  }
};

export const getChatList = async (userId: string) => {
  try {
    // Get all unique user IDs the current user has chatted with
    const sentQuery = supabase
      .from('chat_messages')
      .select('receiver_id')
      .eq('sender_id', userId);
      
    const receivedQuery = supabase
      .from('chat_messages')
      .select('sender_id')
      .eq('receiver_id', userId);
      
    const [sentRes, receivedRes] = await Promise.all([sentQuery, receivedQuery]);
    
    if (sentRes.error) throw sentRes.error;
    if (receivedRes.error) throw receivedRes.error;
      
    // Combine unique user IDs
    const chatPartnerIds = [
      ...new Set([
        ...(sentRes.data || []).map(msg => msg.receiver_id),
        ...(receivedRes.data || []).map(msg => msg.sender_id)
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
        
        if (error && error.code !== 'PGRST116') {
          console.error(`Error getting latest message with ${partnerId}:`, error);
          return null;
        }
        
        const profile = profiles?.find(p => p.id === partnerId);
        
        return {
          partnerId,
          profile,
          latestMessage: data || null,
          unreadCount: 0 // Will be calculated next
        };
      })
    );
    
    // Filter out null results
    const validChatPreviews = chatPreviews.filter(Boolean);
    
    // Calculate unread messages for each chat
    await Promise.all(
      validChatPreviews.map(async (preview) => {
        if (!preview) return;
        
        const { count, error } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', preview.partnerId)
          .eq('receiver_id', userId)
          .eq('read', false);
        
        if (!error) {
          preview.unreadCount = count || 0;
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
