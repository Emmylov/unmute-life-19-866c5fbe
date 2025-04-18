
import React, { ReactNode, useEffect } from "react";
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
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {!isReelsPage && <Navbar pageTitle={pageTitle} />}
      
      <div className={`flex flex-grow ${isReelsPage ? '' : 'pt-1'}`}>
        {!isMobile && <Sidebar />}
        
        <main className={`flex-1 ${showMobileNav ? 'pb-16' : 'pb-0'}`}>
          <div className={`h-full ${isReelsPage ? 'p-0 max-w-none' : 'px-0 md:px-4 lg:px-5'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
