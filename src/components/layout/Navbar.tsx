
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile, useIsTablet } from "@/hooks/use-responsive";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import MobileMenu from "./navbar/MobileMenu";
import SearchBar from "./navbar/SearchBar";
import CreateContentButton from "./navbar/CreateContentButton";
import MessagesButton from "./navbar/MessagesButton";
import NotificationBell from "@/components/notifications/NotificationBell";
import UserProfileDropdown from "./navbar/UserProfileDropdown";
import { getInitials, getAvatarFallbackColor } from "./navbar/NavbarUtils";

interface NavbarProps {
  pageTitle?: string;
}

const Navbar = ({ pageTitle }: NavbarProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data && !error) {
          setProfile(data);
        }
        
        fetchUnreadMessages(user.id);
      }
    };
    
    getUser();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `receiver_id=eq.${user.id}` 
        }, 
        (payload) => {
          if (payload.new && !payload.new.read) {
            setUnreadMessages(prev => prev + 1);
            
            toast({
              title: "New message",
              description: "You have received a new message",
              duration: 3000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);
  
  const fetchUnreadMessages = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('read', false);
      
      if (!error && count !== null) {
        setUnreadMessages(count);
      }
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account",
      duration: 3000,
    });
    navigate("/");
  };
  
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 w-full h-10 md:h-12">
      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3">
        <div className="flex items-center justify-between h-10 md:h-12">
          <div className="flex items-center">
            {isMobile && (
              <MobileMenu
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                profile={profile}
                user={user}
                handleSignOut={handleSignOut}
                getInitials={getInitials}
                getAvatarFallbackColor={getAvatarFallbackColor}
              />
            )}
            
            <Link to="/home" className="flex items-center">
              <span className="text-base font-bold bg-gradient-to-r from-unmute-purple to-unmute-pink bg-clip-text text-transparent">Unmute</span>
            </Link>
            
            {pageTitle && (
              <div className="ml-1.5 md:ml-2 flex items-center">
                <span className="text-gray-400 mx-0.5">/</span>
                <h1 className="text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">{pageTitle}</h1>
              </div>
            )}
          </div>
          
          <SearchBar isMobile={isMobile} isTablet={isTablet} />
          
          <div className="flex items-center space-x-0.5 sm:space-x-1">
            <CreateContentButton />
            <MessagesButton unreadMessages={unreadMessages} />
            <NotificationBell />
            
            <UserProfileDropdown
              profile={profile}
              user={user}
              unreadMessages={unreadMessages}
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
