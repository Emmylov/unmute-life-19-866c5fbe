
import React, { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useIsMobile, useIsTablet } from "@/hooks/use-responsive";
import { useLocation, Link } from "react-router-dom";
import { 
  Home, 
  Search, 
  Film, 
  Users, 
  Bell, 
  User,
  Heart,
  Smile
} from "lucide-react";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const AppLayout = ({ children, pageTitle }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle={pageTitle} />
      
      <div className="flex">
        {!isMobile && <Sidebar collapsed={isTablet} />}
        
        <main className="flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
            {children}
          </div>
        </main>
      </div>
      
      {isMobile && <MobileNavigation currentPath={location.pathname} />}
    </div>
  );
};

interface MobileNavigationProps {
  currentPath: string;
}

const MobileNavigation = ({ currentPath }: MobileNavigationProps) => {
  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 flex items-center justify-around z-50 shadow-lg"
    >
      <NavLink 
        icon={<Home className="h-5 w-5" />} 
        label="Home" 
        to="/home" 
        isActive={currentPath === '/home'} 
      />
      <NavLink 
        icon={<Search className="h-5 w-5" />} 
        label="Explore" 
        to="/explore" 
        isActive={currentPath === '/explore'} 
      />
      <NavLink 
        icon={<Film className="h-5 w-5" />} 
        label="Reels" 
        to="/reels" 
        isActive={currentPath === '/reels'} 
      />
      <NavLink 
        icon={<Smile className="h-5 w-5" />} 
        label="Vibe" 
        to="/vibe-check" 
        isActive={currentPath === '/vibe-check'} 
      />
      <NavLink 
        icon={<User className="h-5 w-5" />} 
        label="Profile" 
        to="/profile" 
        isActive={currentPath === '/profile'} 
      />
    </motion.nav>
  );
};

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
}

const NavLink = ({ icon, label, to, isActive = false }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className="relative flex flex-col items-center py-1.5"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center mb-1 ${
          isActive ? "text-primary font-medium" : "text-gray-500"
        }`}
      >
        {icon}
        {isActive && (
          <motion.div 
            layoutId="activeTab" 
            className="absolute -bottom-1 left-1/2 w-5 h-1 bg-primary rounded-full transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
      <span
        className={`text-xs ${
          isActive ? "text-primary font-medium" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

export default AppLayout;
