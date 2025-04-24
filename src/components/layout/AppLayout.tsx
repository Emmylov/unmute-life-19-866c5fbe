
import React, { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useIsMobile, useIsTablet } from "@/hooks/use-responsive";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const AppLayout = ({ children, pageTitle }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const location = useLocation();
  const isReelsPage = location.pathname === '/reels';
  const showMobileNav = isMobile && !isReelsPage;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {!isReelsPage && <Navbar pageTitle={pageTitle} />}
      
      <div className={`flex flex-grow ${isReelsPage ? '' : 'pt-2'}`}>
        {!isMobile && <Sidebar />}
        
        <main className={`flex-1 ${showMobileNav ? 'pb-20' : 'pb-6'} overflow-x-hidden`}>
          <div className={`h-full ${isReelsPage ? 'p-0 max-w-none' : 'px-3 md:px-4 lg:px-5 pt-2'}`}>
            {children}
          </div>
        </main>
      </div>
      
      {showMobileNav && <div className="h-16" />}
    </div>
  );
};

export default AppLayout;
