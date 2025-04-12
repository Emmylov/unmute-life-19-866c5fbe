
import React from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const NotificationsList: React.FC = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-unmute-purple" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500 mb-2">No notifications yet</p>
        <p className="text-sm text-gray-400">
          When someone follows you or likes your content, you'll see it here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">
          Notifications {unreadCount > 0 && <span className="text-unmute-purple">({unreadCount})</span>}
        </h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs text-unmute-purple hover:text-unmute-purple/80 flex items-center gap-1"
          >
            <Check className="h-3 w-3" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: !notification.read ? 0.8 : 1, backgroundColor: !notification.read ? "rgba(243, 244, 246, 1)" : "rgba(255, 255, 255, 1)" }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`p-3 border-b hover:bg-gray-50 ${
              !notification.read ? "bg-gray-50" : ""
            } transition-colors`}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={notification.from_user?.avatar || ""} alt="User" />
                <AvatarFallback>
                  {notification.from_user?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{notification.from_user?.username || "Someone"}</span>{" "}
                  {notification.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-unmute-purple hover:text-unmute-purple/80 flex items-center gap-1 transition-all hover:bg-unmute-purple/10"
                  onClick={() => markAsRead(notification.id)}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark as read
                  </motion.div>
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsList;
