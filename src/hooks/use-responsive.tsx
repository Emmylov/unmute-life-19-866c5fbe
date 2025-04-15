
import { useState, useEffect } from "react";

// More precise breakpoint values in pixels
const BREAKPOINTS = {
  mobile: 640,   // Small mobile devices
  mobileMedium: 768,  // Medium mobile devices
  tablet: 1024,  // Tablets
  desktop: 1280, // Desktops
  largeDesktop: 1536  // Large desktops
};

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobileMedium);
    };
    
    // Initial check
    checkSize();
    
    // Set up event listener for window resize
    window.addEventListener("resize", checkSize);
    
    // Clean up
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= BREAKPOINTS.mobileMedium && width < BREAKPOINTS.desktop);
    };
    
    // Initial check
    checkSize();
    
    // Set up event listener for window resize
    window.addEventListener("resize", checkSize);
    
    // Clean up
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isTablet;
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth >= BREAKPOINTS.desktop);
    };
    
    // Initial check
    checkSize();
    
    // Set up event listener for window resize
    window.addEventListener("resize", checkSize);
    
    // Clean up
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isDesktop;
}

export function useScreenSize() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  
  return { 
    isMobile, 
    isTablet, 
    isDesktop,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0 
  };
}
