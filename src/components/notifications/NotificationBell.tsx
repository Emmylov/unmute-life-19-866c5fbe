
import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";
import NotificationsList from "./NotificationsList";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { unreadCount, fetchNotifications, notifications, loading } = useNotifications();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousUnreadCount = useRef(unreadCount);
  
  // Initialize audio element
  useEffect(() => {
    try {
      audioRef.current = new Audio("/notification-sound.mp3");
    } catch (err) {
      console.error("Error creating audio element:", err);
    }
  }, []);

  // Play sound when new notifications arrive
  useEffect(() => {
    if (unreadCount > previousUnreadCount.current && previousUnreadCount.current !== 0) {
      // Play notification sound
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error("Error playing notification sound:", err);
        });
      }
      
      // Show toast notification
      toast("New notification", {
        description: "You have received a new notification",
      });
    }
    previousUnreadCount.current = unreadCount;
  }, [unreadCount]);
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      fetchNotifications();
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate('/notifications');
  };
  
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-unmute-purple text-[10px] text-white animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex flex-col">
          <NotificationsList />
          <div className="p-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-unmute-purple" 
              onClick={handleViewAll}
            >
              View all notifications
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
