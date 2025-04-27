
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useIsDesktop } from "@/hooks/use-responsive";
import { LogOut, Settings, User } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";

// Properly define the interface for the component props
interface UserProfileDropdownProps {
  profile?: any;
  user?: any;
  unreadMessages?: number;
  handleSignOut?: () => Promise<void>;
  getInitials?: (name?: string) => string;
  getAvatarFallbackColor?: (userId?: string) => string;
}

const UserProfileDropdown = (props: UserProfileDropdownProps = {}) => {
  // Use props or fallback to context values for backward compatibility
  const authContext = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isDesktop = useIsDesktop();
  const { t } = useTranslation();

  // Use props with fallback to context values
  const user = props.user || authContext.user;
  const profile = props.profile || authContext.profile;
  
  // Use provided handleSignOut or fallback to our own implementation
  const handleSignOut = async () => {
    try {
      if (props.handleSignOut) {
        await props.handleSignOut();
      } else {
        await authContext.signOut();
        navigate("/auth");
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full border-2 border-transparent hover:border-unmute-purple/30 transition-colors">
          <Avatar className="h-7 w-7">
            <AvatarImage src={profile?.avatar || ""} alt={profile?.full_name || "Avatar"} />
            <AvatarFallback>
              {props.getInitials 
                ? props.getInitials(profile?.full_name) 
                : profile?.full_name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="h-4 w-4 mr-2" />
          {t('common.profile')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="h-4 w-4 mr-2" />
          {t('common.settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          {t('auth.signOut', 'Sign Out')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-2">
          <LanguageSwitcher />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
