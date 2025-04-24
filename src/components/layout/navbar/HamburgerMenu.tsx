
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile } = useAuth();

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Explore', path: '/explore' },
    { name: 'Communities', path: '/communities' },
    { name: 'Reels', path: '/reels' },
    { name: 'Chat', path: '/chat' },
    { name: 'Notifications', path: '/notifications' },
    { name: 'Profile', path: '/profile' },
    { name: 'Wellness', path: '/wellness' },
    { name: 'Wellness Plus', path: '/wellness-plus' },
    { name: 'Saved', path: '/saved' },
    { name: 'Content Creator', path: '/content-creator' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] max-w-[300px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <div className="h-8 w-8 mr-2 bg-gradient-to-r from-unmute-purple to-unmute-pink rounded-md flex items-center justify-center text-white font-bold">
                U
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-unmute-purple to-unmute-pink bg-clip-text text-transparent">Unmute</span>
            </div>
          </div>
          
          {profile && (
            <div className="p-4 border-b">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={profile.avatar || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
                    {profile.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {profile.full_name || profile.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{profile.username || 'username'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
