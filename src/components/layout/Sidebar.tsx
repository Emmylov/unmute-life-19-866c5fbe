
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  Compass, 
  Video, 
  Users, 
  Bell,
  Bookmark,
  Settings,
  User,
  BadgeHelp,
  LogOut,
  PlusCircle,
  Heart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const sidebarAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account",
      duration: 3000,
    });
    window.location.href = "/";
  };
  
  return (
    <motion.aside 
      className={`hidden md:flex flex-col ${collapsed ? 'w-20' : 'w-64'} bg-white/80 backdrop-blur-md border-r border-gray-100 min-h-screen transition-all duration-300`}
      initial="hidden"
      animate="visible"
      variants={sidebarAnimation}
    >
      <div className="p-6">
        <motion.nav 
          className="mt-4 flex flex-col space-y-1"
          variants={itemAnimation}
        >
          <SidebarLink 
            to="/home" 
            icon={<Home className="h-5 w-5" />} 
            label="Home"
            isActive={location.pathname === '/home'}
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/explore" 
            icon={<Compass className="h-5 w-5" />} 
            label="Explore"
            isActive={location.pathname === '/explore'}
            hasNotification
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/reels" 
            icon={<Video className="h-5 w-5" />} 
            label="Reels"
            isActive={location.pathname === '/reels'}
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/wellness" 
            icon={<Heart className="h-5 w-5" />} 
            label="Wellness"
            isActive={location.pathname === '/wellness' || location.pathname === '/wellness/plus'}
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/communities" 
            icon={<Users className="h-5 w-5" />} 
            label="Communities"
            isActive={location.pathname === '/communities'}
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/notifications" 
            icon={<Bell className="h-5 w-5" />} 
            label="Notifications"
            isActive={location.pathname === '/notifications'}
            hasNotification
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/saved" 
            icon={<Bookmark className="h-5 w-5" />} 
            label="Saved"
            isActive={location.pathname === '/saved'}
            collapsed={collapsed}
          />
        </motion.nav>
        
        <motion.div
          className="mt-8 flex justify-center"
          variants={itemAnimation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button 
            onClick={() => navigate('/create')}
            className={`${collapsed ? 'p-3' : 'w-full py-3 px-4'} bg-cosmic-crush text-white rounded-full font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all`}
          >
            <PlusCircle className="h-5 w-5" />
            {!collapsed && "Create Content"}
          </button>
        </motion.div>
        
        {!collapsed && (
          <motion.h2 
            className="text-lg font-semibold mt-8 mb-2"
            variants={itemAnimation}
          >
            Account
          </motion.h2>
        )}
        
        <motion.nav 
          className="mt-4 flex flex-col space-y-1"
          variants={itemAnimation}
        >
          <SidebarLink 
            to="/profile" 
            icon={<User className="h-5 w-5" />} 
            label="Profile"
            isActive={location.pathname === '/profile'}
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/settings" 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings"
            isActive={location.pathname === '/settings'}
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/help" 
            icon={<BadgeHelp className="h-5 w-5" />} 
            label="Help"
            isActive={location.pathname === '/help'}
            collapsed={collapsed}
          />
          <div
            onClick={handleSignOut}
            className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-xl transition-colors text-gray-600 hover:bg-gray-100 cursor-pointer`}
          >
            <span className={collapsed ? "" : "mr-3"}>
              <LogOut className="h-5 w-5 text-gray-500" />
            </span>
            {!collapsed && "Sign out"}
          </div>
        </motion.nav>
      </div>
      
      {!collapsed && (
        <div className="mt-auto p-6 border-t border-gray-100">
          <div className="bg-dream-mist rounded-xl p-4">
            <h4 className="text-sm font-medium mb-2">Upgrade to Pro</h4>
            <p className="text-xs text-gray-600 mb-3">Get access to premium features</p>
            <button className="text-xs px-3 py-1.5 bg-cosmic-crush text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all">
              Learn more
            </button>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  hasNotification?: boolean;
  collapsed?: boolean;
}

const SidebarLink = ({ to, icon, label, isActive = false, hasNotification = false, collapsed = false }: SidebarLinkProps) => {
  return (
    <motion.div variants={itemAnimation}>
      <NavLink
        to={to}
        className={`
          flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 text-sm font-medium rounded-xl transition-all relative
          ${
            isActive
              ? "bg-unmute-purple/20 text-unmute-purple-dark font-bold"
              : "text-gray-600 hover:bg-gray-100"
          }
        `}
        title={collapsed ? label : undefined}
      >
        <span className={collapsed ? "" : "mr-3"}>{icon}</span>
        {!collapsed && label}
        
        {hasNotification && (
          <span className={`h-2 w-2 bg-secondary rounded-full ${collapsed ? "absolute top-2 right-2" : "absolute right-4 top-1/2 transform -translate-y-1/2"}`} />
        )}
      </NavLink>
    </motion.div>
  );
};

export default Sidebar;
