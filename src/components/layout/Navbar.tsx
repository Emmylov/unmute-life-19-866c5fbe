import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./navbar/SearchBar";
import MessagesButton from "./navbar/MessagesButton";
import NotificationBell from "@/components/notifications/NotificationBell";
import UserProfileDropdown from "./navbar/UserProfileDropdown";
import { useIsMobile, useIsTablet } from "@/hooks/use-responsive";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials, getAvatarFallbackColor } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

interface NavbarProps {
  pageTitle?: string;
}

const Navbar = ({ pageTitle }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <Sidebar className="border-none" />
              </SheetContent>
            </Sheet>
            
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
