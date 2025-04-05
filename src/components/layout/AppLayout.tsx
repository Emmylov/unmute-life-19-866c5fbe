
import React, { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {children}
          </div>
        </main>
      </div>
      
      {isMobile && <MobileNavigation />}
    </div>
  );
};

const MobileNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-around z-10">
      <NavLink icon="home" label="Home" isActive />
      <NavLink icon="search" label="Explore" />
      <NavLink icon="plus-circle" label="Create" />
      <NavLink icon="message-circle" label="Chat" />
      <NavLink icon="user" label="Profile" />
    </nav>
  );
};

const NavLink = ({ icon, label, isActive = false }: { icon: string; label: string; isActive?: boolean }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-6 h-6 mb-1 ${
          isActive ? "text-unmute-purple" : "text-gray-500"
        }`}
      >
        <i className={`icon-${icon}`} />
      </div>
      <span
        className={`text-xs ${
          isActive ? "text-unmute-purple font-medium" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default AppLayout;
