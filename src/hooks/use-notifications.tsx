
import { useState, useEffect } from "react";
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
const notificationSound = new Audio("/notification-sound.mp3");

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  
  // Fetch notifications for the current user
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
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
        throw error;
      }
      
      // Cast the data to the Notification type after handling potential errors with from_user
      const processedData = (data || []).map(item => {
        // Handle case where from_user is an error object
        if (item.from_user && 'error' in item.from_user) {
          return {
            ...item,
            from_user: null
          };
        }
        return item;
      }) as unknown as Notification[];
      
      setNotifications(processedData);
      
      // Count unread notifications
      const unread = processedData.filter(n => !n.read).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };
  
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

      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
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
      
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };
  
  // Listen for real-time notification updates
  useEffect(() => {
    if (!user) return;
    
    // Fetch initial notifications
    fetchNotifications();
    
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
        (payload) => {
          // Play notification sound
          try {
            notificationSound.play().catch(err => console.log('Audio playback prevented:', err));
          } catch (e) {
            console.log('Audio playback error:', e);
          }
          
          // Add the new notification to our state
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show a toast notification
          toast("New notification", {
            description: newNotification.content,
            action: {
              label: "View",
              onClick: () => markAsRead(newNotification.id),
            },
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
  
  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};
