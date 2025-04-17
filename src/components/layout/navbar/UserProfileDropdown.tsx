
import React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfileDropdownProps {
  profile: any;
  user: any;
  unreadMessages: number;
  handleSignOut: () => void;
  getInitials: (name?: string) => string;
  getAvatarFallbackColor: (userId?: string) => string;
}

const UserProfileDropdown = ({
  profile,
  user,
  unreadMessages,
  handleSignOut,
  getInitials,
  getAvatarFallbackColor
}: UserProfileDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-6 w-6 md:h-7 md:w-7 cursor-pointer ring-1 ring-white hover:ring-unmute-purple/20 transition-all">
          <AvatarImage 
            src={profile?.avatar || ''} 
            alt={profile?.username || user?.email || 'User'}
          />
          <AvatarFallback className={`${getAvatarFallbackColor(user?.id)} text-white text-xs`}>
            {profile?.username 
              ? getInitials(profile.username)
              : profile?.full_name 
                ? getInitials(profile.full_name)
                : user?.email
                  ? getInitials(user.email)
                  : "U"
            }
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-card">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/create" className="cursor-pointer">Create Content</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/chat" className="cursor-pointer">Messages {unreadMessages > 0 && `(${unreadMessages})`}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
