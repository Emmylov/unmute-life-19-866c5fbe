
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavbarNotifications from './NavbarNotifications';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import EarlyAdopterRewards from '@/components/launch/EarlyAdopterRewards';

const NavbarActions = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  
  // Don't show navbar actions on auth pages
  if (location.pathname === '/auth' || location.pathname === '/') {
    return null;
  }
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getAvatarFallbackColor = (userId?: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 
      'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'
    ];
    
    if (!userId) return colors[0];
    
    // Use the last character of the user ID to determine the color
    const lastChar = userId.charCodeAt(userId.length - 1);
    const colorIndex = lastChar % colors.length;
    
    return colors[colorIndex];
  };
  
  return (
    <div className="flex items-center gap-2">
      <EarlyAdopterRewards />
      
      <NavbarNotifications />
      
      {profile && (
        <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar} />
            <AvatarFallback className={getAvatarFallbackColor(user?.id)}>
              {getInitials(profile?.username || user?.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      )}
    </div>
  );
};

export default NavbarActions;
