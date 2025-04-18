
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
  
  // Hide mobile navigation on Reels page on mobile to give more space
  const isReelsPage = location.pathname === '/reels';
  const showMobileNav = isMobile && !isReelsPage;
  
  // For better UX, we want the page to scroll to top when navigating
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {!isReelsPage && <Navbar pageTitle={pageTitle} />}
      
      <div className={`flex flex-grow ${isReelsPage ? '' : ''}`}>
        {!isMobile && <Sidebar />}
        
        <main className={`flex-1 ${showMobileNav ? 'pb-16' : 'pb-0'} ${!isMobile ? 'mt-1' : 'mt-0'}`}>
          <div className={`${isReelsPage ? 'p-0 max-w-none' : 'px-0 py-0 md:px-4 lg:px-5'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
