
import React, { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bell, Check } from "lucide-react";

const Notifications = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  
  // Fetch notifications when the page loads
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-6">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-unmute-purple" />
                <CardTitle className="text-2xl font-bold">
                  Notifications 
                  {unreadCount > 0 && (
                    <Badge variant="default" className="ml-2 bg-unmute-purple animate-pulse">
                      {unreadCount} new
                    </Badge>
                  )}
                </CardTitle>
              </div>
              
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          
          <Tabs defaultValue="all" className="px-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-2">
              <NotificationsList 
                notifications={notifications} 
                loading={loading} 
                markAsRead={markAsRead} 
                showAll
              />
            </TabsContent>
            
            <TabsContent value="unread" className="mt-2">
              <NotificationsList 
                notifications={notifications.filter(n => !n.read)} 
                loading={loading} 
                markAsRead={markAsRead} 
                showAll={false}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
};

interface NotificationsListProps {
  notifications: any[];
  loading: boolean;
  markAsRead: (id: string) => void;
  showAll: boolean;
}

const NotificationsList = ({ notifications, loading, markAsRead, showAll }: NotificationsListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-unmute-purple" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg text-gray-500 mb-2">
          {showAll ? "No notifications yet" : "No unread notifications"}
        </p>
        <p className="text-sm text-gray-400">
          When someone follows you or likes your content, you'll see it here
        </p>
      </div>
    );
  }

  return (
    <CardContent className="p-0">
      <ul className="divide-y">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-4 transition-colors ${!notification.read ? "bg-gray-50" : ""}`}
          >
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={notification.from_user?.avatar || ""} />
                <AvatarFallback className="bg-unmute-blue text-white">
                  {notification.from_user?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p>
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
                  className="text-xs text-unmute-purple hover:text-unmute-purple/80 flex items-center gap-1"
                  onClick={() => markAsRead(notification.id)}
                >
                  <Check className="h-3 w-3" />
                  Mark as read
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  );
};

export default Notifications;
