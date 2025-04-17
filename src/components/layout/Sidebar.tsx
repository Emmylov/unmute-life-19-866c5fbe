
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home,
  Compass,
  Users,
  Film,
  MessageSquare,
  Bell,
  HeartPulse,
  Bookmark,
  Pencil,
  UserPlus,
  ActivitySquare,
  Settings,
  LogOut,
  Music,
  Gamepad2,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const navigationLinks = [
    { icon: <Home className="h-5 w-5 shrink-0" />, label: "Home", path: "/home" },
    { icon: <Compass className="h-5 w-5 shrink-0" />, label: "Explore", path: "/explore" },
    { icon: <Film className="h-5 w-5 shrink-0" />, label: "Reels", path: "/reels" },
    { icon: <Users className="h-5 w-5 shrink-0" />, label: "Communities", path: "/communities" },
    { icon: <MessageSquare className="h-5 w-5 shrink-0" />, label: "Chat", path: "/chat" },
    { icon: <Bell className="h-5 w-5 shrink-0" />, label: "Notifications", path: "/notifications" },
    { icon: <HeartPulse className="h-5 w-5 shrink-0" />, label: "Wellness", path: "/wellness" },
    { icon: <Bookmark className="h-5 w-5 shrink-0" />, label: "Saved", path: "/saved" },
    { icon: <Pencil className="h-5 w-5 shrink-0" />, label: "Content Creator", path: "/content-creator" },
    { icon: <UserPlus className="h-5 w-5 shrink-0" />, label: "Create Collab", path: "/create-collab" },
    { icon: <ActivitySquare className="h-5 w-5 shrink-0" />, label: "Vibe Check", path: "/vibe-check" },
    { icon: <Gamepad2 className="h-5 w-5 shrink-0" />, label: "Games", path: "/games" },
    { icon: <Music className="h-5 w-5 shrink-0" />, label: "Music", path: "/music" },
    { icon: <Settings className="h-5 w-5 shrink-0" />, label: "Settings", path: "/settings" },
  ];

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative flex items-center justify-center p-0 h-8 w-8 hover:bg-gray-100 rounded-full fixed left-4 top-3 z-50"
        >
          <Menu className="h-5 w-5 text-gray-600" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px] sm:w-[350px]">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle>
            <span className="text-xl font-bold bg-gradient-to-r from-unmute-purple to-unmute-pink bg-clip-text text-transparent">
              Unmute
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full overflow-y-auto p-3">
          {profile && (
            <div className="px-4 py-3 mb-2 flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={profile?.avatar} alt={profile?.username || "User"} />
                <AvatarFallback className="bg-primary/20">{getInitials(profile?.username || "User")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium truncate">{profile?.username || profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">@{profile?.username || "username"}</p>
              </div>
            </div>
          )}

          <nav className="space-y-1 mt-2">
            {navigationLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  pathname === item.path
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="ml-2 text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          <button 
            onClick={handleSignOut}
            className="flex items-center p-2 mt-auto text-left rounded-md text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="ml-2 text-sm">Sign Out</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
