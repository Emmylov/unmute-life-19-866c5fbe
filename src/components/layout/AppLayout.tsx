
import React, { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  Film, 
  Users, 
  Bell, 
  User
} from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-around z-10">
      <NavLink icon={<Home className="h-6 w-6" />} label="Home" to="/home" isActive={currentPath === '/home'} />
      <NavLink icon={<Search className="h-6 w-6" />} label="Explore" to="/explore" isActive={currentPath === '/explore'} />
      <NavLink icon={<Film className="h-6 w-6" />} label="Reels" to="/reels" isActive={currentPath === '/reels'} />
      <NavLink icon={<Users className="h-6 w-6" />} label="Community" to="/communities" isActive={currentPath === '/communities'} />
      <NavLink icon={<User className="h-6 w-6" />} label="Profile" to="/profile" isActive={currentPath === '/profile'} />
    </nav>
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
    <a 
      href={to}
      className="flex flex-col items-center"
    >
      <div
        className={`mb-1 ${
          isActive ? "text-unmute-purple" : "text-gray-500"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-xs ${
          isActive ? "text-unmute-purple font-medium" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </a>
  );
};

export default AppLayout;
