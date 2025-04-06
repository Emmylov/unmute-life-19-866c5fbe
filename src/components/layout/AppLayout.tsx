
import React, { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, Link } from "react-router-dom";
import { 
  Home, 
  Search, 
  Film, 
  Users, 
  Bell, 
  User
} from "lucide-react";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const AppLayout = ({ children, pageTitle }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle={pageTitle} />
      
      <div className="flex">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-10"
    >
      <NavLink icon={<Home className="h-6 w-6" />} label="Home" to="/home" isActive={currentPath === '/home'} />
      <NavLink icon={<Search className="h-6 w-6" />} label="Explore" to="/explore" isActive={currentPath === '/explore'} />
      <NavLink icon={<Film className="h-6 w-6" />} label="Reels" to="/reels" isActive={currentPath === '/reels'} />
      <NavLink icon={<Users className="h-6 w-6" />} label="Community" to="/communities" isActive={currentPath === '/communities'} />
      <NavLink icon={<User className="h-6 w-6" />} label="Profile" to="/profile" isActive={currentPath === '/profile'} />
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
      className="relative flex flex-col items-center"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`mb-1 ${
          isActive ? "text-unmute-purple-dark" : "text-gray-500"
        }`}
      >
        {icon}
        {isActive && (
          <motion.div 
            layoutId="activeTab" 
            className="absolute -bottom-1 left-1/2 w-5 h-1 bg-unmute-purple rounded-full transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
      <span
        className={`text-xs ${
          isActive ? "text-unmute-purple-dark font-medium" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

export default AppLayout;
