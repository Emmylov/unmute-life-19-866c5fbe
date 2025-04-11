
import { supabase } from "@/integrations/supabase/client";

// Types of notifications
export enum NotificationType {
  LIKE = "like",
  COMMENT = "comment",
  FOLLOW = "follow",
  MENTION = "mention",
  SYSTEM = "system",
}

// Create a new notification
export const createNotification = async (
  userId: string,
  fromUserId: string,
  type: NotificationType,
  content: string,
  referenceId?: string,
  referenceType?: string
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        from_user_id: fromUserId,
        type,
        content,
        reference_id: referenceId,
        reference_type: referenceType,
        read: false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update notification count in user profile
    await incrementNotificationCount(userId);

    return data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Increment the notification count in user profile
const incrementNotificationCount = async (userId: string) => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("notification_count")
      .eq("id", userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const currentCount = profile?.notification_count || 0;
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ notification_count: currentCount + 1 })
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error("Error updating notification count:", error);
  }
};

// Helper function to create like notifications
export const createLikeNotification = async (
  userId: string,
  fromUserId: string,
  contentType: string,
  contentId: string
) => {
  const content = `liked your ${contentType}`;
  return createNotification(
    userId,
    fromUserId,
    NotificationType.LIKE,
    content,
    contentId,
    contentType
  );
};

// Helper function to create comment notifications
export const createCommentNotification = async (
  userId: string,
  fromUserId: string,
  contentType: string,
  contentId: string
) => {
  const content = `commented on your ${contentType}`;
  return createNotification(
    userId,
    fromUserId,
    NotificationType.COMMENT,
    content,
    contentId,
    contentType
  );
};

// Helper function to create follow notifications
export const createFollowNotification = async (
  userId: string,
  fromUserId: string
) => {
  const content = `started following you`;
  return createNotification(
    userId,
    fromUserId,
    NotificationType.FOLLOW,
    content
  );
};
