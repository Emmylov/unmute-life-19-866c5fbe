
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, Bell, MessageCircle, LogOut, PlusCircle } from "lucide-react";
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

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
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
  
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
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
                  placeholder="Search voices, people, and communities..." 
                  className="pl-10 bg-gray-50/80 border-none focus-visible:ring-primary/30 rounded-full"
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
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={`relative text-primary hover:text-primary/80 transition-colors ${location.pathname === '/create' ? 'bg-primary/10' : ''}`}
              onClick={() => navigate('/create')}
            >
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Create</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-secondary"></span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-white hover:ring-primary/20 transition-all">
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
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 rounded-full"
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
