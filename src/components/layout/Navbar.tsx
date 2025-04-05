
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, Bell, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <Link to="/home" className="flex items-center">
              <span className="text-xl font-bold unmute-gradient-text">Unmute</span>
            </Link>
          </div>
          
          {/* Desktop Search */}
          {!isMobile && (
            <div className="max-w-md w-full mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10"
                />
              </div>
            </div>
          )}
          
          {/* Right Nav Items */}
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-unmute-purple text-white text-sm">U</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        {/* Mobile Search (expandable) */}
        {isMobile && isSearchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
