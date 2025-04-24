import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Compass, 
  Users, 
  Film, 
  MessageCircle, 
  Bell, 
  User, 
  Heart, 
  Bookmark, 
  PenSquare, 
  UserPlus, 
  Sparkles, 
  Settings,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { user, profile } = useAuth();

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Communities', path: '/communities', icon: Users },
    { name: 'Reels', path: '/reels', icon: Film },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Wellness', path: '/wellness', icon: Heart },
    { name: 'Saved', path: '/saved', icon: Bookmark },
    { name: 'Content Creator', path: '/content-creator', icon: PenSquare },
    { name: 'Create Collab', path: '/create-collab', icon: UserPlus },
    { name: 'Vibe Check', path: '/vibe-check', icon: Sparkles },
    { name: 'Store', path: '/store', icon: ShoppingBag },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className={cn("flex flex-col h-full py-4 border-r", className)}>
      <div className="px-4 mb-6">
        <Link to="/home" className="flex items-center">
          <img src="/logo.svg" alt="Unmute Logo" className="h-8 w-8" />
          <span className="ml-2 text-xl font-bold">Unmute</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name}>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto px-4">
        {profile && (
          <Button variant="ghost" className="w-full justify-start px-2 py-6">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={profile.avatar || ''} />
              <AvatarFallback>{profile.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{profile.full_name || profile.username}</span>
              <span className="text-xs text-gray-500">@{profile.username}</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
