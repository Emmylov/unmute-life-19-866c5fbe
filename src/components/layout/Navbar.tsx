
import React from "react";
import { Link } from "react-router-dom";
import HamburgerMenu from "./navbar/HamburgerMenu";
import SearchBar from "./navbar/SearchBar";
import CreateContentButton from "./navbar/CreateContentButton";
import MessagesButton from "./navbar/MessagesButton";
import NotificationBell from "@/components/notifications/NotificationBell";
import UserProfileDropdown from "./navbar/UserProfileDropdown";
import { useIsMobile, useIsTablet } from "@/hooks/use-responsive";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials, getAvatarFallbackColor } from "@/lib/utils";

interface NavbarProps {
  pageTitle?: string;
}

const Navbar = ({ pageTitle }: NavbarProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { user, profile, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <HamburgerMenu />
            
            <Link to="/home" className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-unmute-purple to-unmute-pink rounded-md flex items-center justify-center text-white font-bold">
                U
              </div>
              <span className="hidden sm:block ml-2 text-lg font-bold bg-gradient-to-r from-unmute-purple to-unmute-pink bg-clip-text text-transparent">
                Unmute
              </span>
            </Link>
            
            {pageTitle && (
              <div className="hidden sm:flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <h1 className="text-sm font-medium text-gray-900">{pageTitle}</h1>
              </div>
            )}
          </div>

          <SearchBar isMobile={isMobile} isTablet={isTablet} />
          
          <div className="flex items-center space-x-2">
            <CreateContentButton />
            <MessagesButton unreadMessages={0} />
            <NotificationBell />
            <UserProfileDropdown 
              profile={profile} 
              user={user} 
              unreadMessages={0} 
              handleSignOut={handleSignOut}
              getInitials={getInitials} 
              getAvatarFallbackColor={getAvatarFallbackColor}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
