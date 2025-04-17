import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  profile: any;
  user: any;
  handleSignOut: () => void;
  getInitials: (name?: string) => string;
  getAvatarFallbackColor: (userId?: string) => string;
}

const MobileMenu = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  profile,
  user,
  handleSignOut,
  getInitials,
  getAvatarFallbackColor
}: MobileMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationLinks = [
    { name: "Home", path: "/home" },
    { name: "Explore", path: "/explore" },
    { name: "Reels", path: "/reels" },
    { name: "Communities", path: "/communities" },
    { name: "Chat", path: "/chat" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative flex items-center justify-center p-0 h-8 w-8 hover:bg-gray-100 rounded-full"
        >
          <Menu className="h-5 w-5 text-gray-600" />
          <span className="sr-only">Open menu</span>
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
        <div className="py-4">
          {profile && (
            <div className="px-4 py-3 mb-2 flex items-center">
              <Avatar className="h-10 w-10 mr-3 ring-2 ring-white">
                <AvatarImage
                  src={profile?.avatar || ''}
                  alt={profile?.username || user?.email || 'User'}
                />
                <AvatarFallback className={`${getAvatarFallbackColor(user?.id)} text-white`}>
                  {getInitials(profile?.username || profile?.full_name || user?.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">
                  {profile?.username || profile?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500">@{profile?.username || 'username'}</p>
              </div>
            </div>
          )}

          <nav className="mt-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm ${
                  location.pathname === link.path
                    ? "bg-primary/5 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="px-4 pt-4 mt-4 border-t">
            <Button
              onClick={() => {
                navigate('/create');
                setIsMobileMenuOpen(false);
              }}
              className="w-full unmute-primary-button"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </div>

          <div className="px-4 pt-2 pb-4">
            <Button
              variant="outline"
              onClick={() => {
                handleSignOut();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 mt-2"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
