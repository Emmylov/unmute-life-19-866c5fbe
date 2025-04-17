import React, { useState, useEffect } from "react";
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
  User,
  HeartPulse,
  Bookmark,
  Pencil,
  UserPlus,
  ActivitySquare,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  Music,
  Gamepad2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-responsive";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const isMobile = useIsMobile();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  
  const mainNavItems = [
    {
      icon: <Home className="h-5 w-5 shrink-0" />,
      label: "Home",
      path: "/home",
    },
    {
      icon: <Compass className="h-5 w-5 shrink-0" />,
      label: "Explore",
      path: "/explore",
    },
    {
      icon: <Film className="h-5 w-5 shrink-0" />,
      label: "Reels",
      path: "/reels",
    },
    {
      icon: <Users className="h-5 w-5 shrink-0" />,
      label: "Communities",
      path: "/communities",
    },
    {
      icon: <MessageSquare className="h-5 w-5 shrink-0" />,
      label: "Chat",
      path: "/chat",
    },
    {
      icon: <Bell className="h-5 w-5 shrink-0" />,
      label: "Notifications",
      path: "/notifications",
    },
  ];
  
  const secondaryNavItems = [
    {
      icon: <HeartPulse className="h-5 w-5 shrink-0" />,
      label: "Wellness",
      path: "/wellness",
    },
    {
      icon: <Bookmark className="h-5 w-5 shrink-0" />,
      label: "Saved",
      path: "/saved",
    },
    {
      icon: <Pencil className="h-5 w-5 shrink-0" />,
      label: "Content Creator",
      path: "/content-creator",
    },
    {
      icon: <UserPlus className="h-5 w-5 shrink-0" />,
      label: "Create Collab",
      path: "/create-collab",
    },
    {
      icon: <ActivitySquare className="h-5 w-5 shrink-0" />,
      label: "Vibe Check",
      path: "/vibe-check",
    },
    {
      icon: <Gamepad2 className="h-5 w-5 shrink-0" />,
      label: "Games",
      path: "/games",
    },
    {
      icon: <Music className="h-5 w-5 shrink-0" />,
      label: "Music",
      path: "/music",
    },
    {
      icon: <Settings className="h-5 w-5 shrink-0" />,
      label: "Settings",
      path: "/settings",
    },
    {
      icon: <HelpCircle className="h-5 w-5 shrink-0" />,
      label: "Help",
      path: "/help",
    },
  ];
  
  useEffect(() => {
    // Fetch profile data when the component mounts or when the user changes
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data && !error) {
          // Update the profile state with the fetched data
          setProfile(data);
        } else if (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-10 hidden h-screen w-64 flex-col bg-white border-r border-gray-200 pt-14 transition-all duration-300 ease-in-out md:flex",
        collapsed && "w-[70px]"
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto p-3">
        {/* Navigation Links */}
        <nav className="space-y-1 mt-2">
          {mainNavItems.map((item) => (
            <NavItem 
              key={item.path} 
              icon={item.icon} 
              label={item.label} 
              path={item.path} 
              isActive={pathname === item.path}
              collapsed={collapsed}
              badge={item.badge}
            />
          ))}
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>
          
          {/* Secondary Navigation */}
          {secondaryNavItems.map((item) => (
            <NavItem 
              key={item.path} 
              icon={item.icon} 
              label={item.label} 
              path={item.path} 
              isActive={pathname === item.path}
              collapsed={collapsed}
            />
          ))}
          
          {/* User Profile Section */}
          <div className="mt-auto pt-4">
            <div className={cn("flex items-center mt-3 p-2 rounded-md", 
              pathname === '/profile' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
            )}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={profile?.avatar} alt={profile?.username || "User"} />
                <AvatarFallback className="bg-primary/20">{getInitials(profile?.username || profile?.full_name || "User")}</AvatarFallback>
              </Avatar>
              
              {!collapsed && (
                <div className="ml-2 overflow-hidden">
                  <p className="text-sm font-medium truncate">{profile?.username || profile?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">@{profile?.username || "username"}</p>
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className={cn("flex items-center p-2 w-full text-left rounded-md text-destructive hover:bg-destructive/10 mt-2")}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </button>
        </nav>
      </div>
      
      {/* Collapse Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-24 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md"
      >
        <Menu className="h-4 w-4" />
      </button>
    </aside>
  );
};

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  collapsed: boolean;
  badge?: number;
}

const NavItem = ({ icon, label, path, isActive, collapsed, badge }: NavItemProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center p-2 rounded-md transition-colors",
        isActive ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <div className="flex items-center justify-center h-5 w-5 shrink-0">
        {icon}
      </div>
      
      {!collapsed && (
        <>
          <span className="ml-2 text-sm">{label}</span>
          {badge !== undefined && badge > 0 && (
            <Badge
              variant="destructive"
              className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
            >
              {badge > 9 ? "9+" : badge}
            </Badge>
          )}
        </>
      )}
      
      {collapsed && badge !== undefined && badge > 0 && (
        <Badge
          variant="destructive"
          className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-bold translate-x-1 -translate-y-1"
        >
          {badge > 9 ? "9+" : badge}
        </Badge>
      )}
    </Link>
  );
};

export default Sidebar;
