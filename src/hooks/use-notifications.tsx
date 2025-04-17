
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Notification {
  id: string;
  user_id: string;
  from_user_id: string | null;
  type: string;
  content: string;
  read: boolean;
  created_at: string;
  from_user?: {
    username: string;
    avatar: string;
  } | null;
  reference_id?: string;
  reference_type?: string;
}

// Create audio element for notification sounds
let notificationSound: HTMLAudioElement | null = null;
try {
  notificationSound = new Audio("/notification-sound.mp3");
} catch (e) {
  console.error("Failed to initialize notification sound:", e);
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, profile } = useAuth();
  
  // Fetch notifications for the current user
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching notifications for user:", user.id);
      
      // Get notifications with user details of who created the notification
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          from_user:profiles(username, avatar)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (error) {
        console.error("Error fetching notifications:", error);
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }
      
      console.log("Notifications data received:", data);
      
      // Process the data to handle potential errors with from_user
      const processedData: Notification[] = data ? data.map((item: any) => {
        // Handle case where from_user has an error
        const fromUser = item.from_user && typeof item.from_user === 'object' && !('error' in item.from_user)
          ? item.from_user
          : null;
          
        return {
          ...item,
          from_user: fromUser
        };
      }) : [];
      
      setNotifications(processedData);
      
      // Count unread notifications
      const unreadCount = processedData.filter(n => !n.read).length || 0;
      setUnreadCount(unreadCount);
    } catch (error: any) {
      console.error("Error in useNotifications hook:", error);
      setError(error);
      toast("Failed to load notifications", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq("id", notificationId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // If the user profile has notification count, update it as well
      if (user && profile?.notification_count > 0) {
        await supabase
          .from("profiles")
          .update({ notification_count: Math.max(0, profile.notification_count - 1) })
          .eq("id", user.id);
      }
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast("Error", {
        description: "Failed to mark notification as read"
      });
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      // Update profile notification count
      if (user) {
        await supabase
          .from("profiles")
          .update({ notification_count: 0 })
          .eq("id", user.id);
      }
      
      toast("Success", { 
        description: "All notifications marked as read"
      });
    } catch (error: any) {
      console.error("Error marking all notifications as read:", error);
      toast("Error", {
        description: "Failed to mark notifications as read"
      });
    }
  };
  
  // Initialize notifications on component mount
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);
  
  // Listen for real-time notification updates
  useEffect(() => {
    if (!user) return;
    
    console.log("Setting up real-time notification subscription for user:", user.id);
    
    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('notification_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log("New notification received:", payload);
          
          // Play notification sound
          if (notificationSound) {
            notificationSound.play().catch(err => 
              console.log('Audio playback prevented:', err)
            );
          }
          
          // Add the new notification to our state
          const newNotification = payload.new as Notification;
          
          if (!newNotification.from_user_id) {
            // System notification without a user
            const enrichedNotification = {
              ...newNotification,
              from_user: null
            };
            
            setNotifications(prev => [enrichedNotification as Notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            toast("New notification", {
              description: newNotification.content,
              action: {
                label: "View",
                onClick: () => markAsRead(newNotification.id),
              },
            });
            return;
          }
          
          // Fetch the user data for this notification since it's not included in the payload
          try {
            const { data: fromUser, error } = await supabase
              .from('profiles')
              .select('username, avatar')
              .eq('id', newNotification.from_user_id)
              .single();
            
            if (error) {
              console.error("Error fetching user data for notification:", error);
              // Still add notification but without user data
              const enrichedNotification = {
                ...newNotification,
                from_user: null
              };
              
              setNotifications(prev => [enrichedNotification as Notification, ...prev]);
            } else {
              const enrichedNotification = {
                ...newNotification,
                from_user: fromUser
              };
              
              setNotifications(prev => [enrichedNotification as Notification, ...prev]);
            }
            
            setUnreadCount(prev => prev + 1);
            
            // Show a toast notification
            toast("New notification", {
              description: newNotification.content,
              action: {
                label: "View",
                onClick: () => markAsRead(newNotification.id),
              },
            });
          } catch (fetchError) {
            console.error("Error processing new notification:", fetchError);
          }
        }
      )
      .subscribe((status) => {
        console.log("Notification subscription status:", status);
      });
    
    return () => {
      console.log("Cleaning up notification subscription");
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
  
  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};

