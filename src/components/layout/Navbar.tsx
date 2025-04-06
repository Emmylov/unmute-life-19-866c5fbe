
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, Bell, MessageCircle, LogOut, PlusCircle, Video, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  pageTitle?: string;
}

const Navbar = ({ pageTitle }: NavbarProps) => {
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data && !error) {
          setProfile(data);
        }
      }
    };
    
    getUser();
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account",
      duration: 3000,
    });
    navigate("/");
  };
  
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };
  
  const getAvatarFallbackColor = (userId?: string) => {
    if (!userId) return "bg-unmute-purple";
    
    // Generate a deterministic color based on user ID
    const colors = [
      "bg-unmute-purple", "bg-unmute-pink", "bg-unmute-lavender", 
      "bg-unmute-blue", "bg-unmute-mint"
    ];
    
    const index = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const navigationLinks = [
    { name: "Home", path: "/home" },
    { name: "Explore", path: "/explore" },
    { name: "Reels", path: "/reels" },
    { name: "Communities", path: "/communities" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];
  
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center">
            {isMobile && (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
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
            )}
            
            <Link to="/home" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-unmute-purple to-unmute-pink bg-clip-text text-transparent">Unmute</span>
            </Link>
            
            {pageTitle && (
              <div className="ml-4 md:ml-6 flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <h1 className="text-lg font-medium text-gray-900">{pageTitle}</h1>
              </div>
            )}
          </div>
          
          {/* Desktop Search */}
          {!isMobile && (
            <div className="max-w-md w-full mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Search voices, people, and communities..." 
                  className="pl-10 bg-gray-50/80 border-none focus-visible:ring-unmute-purple/30 rounded-full"
                />
              </div>
            </div>
          )}
          
          {/* Right Nav Items */}
          <div className="flex items-center space-x-3">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-500">
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={`relative text-unmute-purple hover:text-unmute-purple/80 transition-colors ${location.pathname === '/create' ? 'bg-unmute-purple/10' : ''}`}
              onClick={() => navigate('/create')}
            >
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Create</span>
            </Button>
            
            <Button 
              className={`hidden sm:flex items-center gap-2 unmute-primary-button px-4 py-2 h-9`}
              onClick={() => navigate('/create')}
            >
              <Video className="h-4 w-4" />
              Create
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-gray-500"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-unmute-pink"></span>
            </Button>
            
            <Button variant="ghost" size="icon" className="text-gray-500">
              <MessageCircle className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-white hover:ring-unmute-purple/20 transition-all">
                  <AvatarImage 
                    src={profile?.avatar || ''} 
                    alt={profile?.username || user?.email || 'User'}
                  />
                  <AvatarFallback className={`${getAvatarFallbackColor(user?.id)} text-white`}>
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
                  <Link to="/settings" className="cursor-pointer">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Search (expandable) */}
        {isMobile && isSearchOpen && (
          <div className="pb-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search..." 
                className="pl-10 rounded-full pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7" 
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
