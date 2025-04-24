
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
    // Scroll to top when route changes
    window.scrollTo(0, 0);
    
    // Add proper viewport meta for mobile devices
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    
    // Fix any iOS-specific issues
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    
    // Update on resize
    const handleResize = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);
  
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
      
      {/* Mobile padding to ensure content isn't hidden behind bottom nav */}
      {isMobile && <div className="h-16" />}
    </div>
  );
};

export default AppLayout;
