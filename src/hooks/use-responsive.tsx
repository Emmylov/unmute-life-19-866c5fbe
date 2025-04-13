
import { useState, useEffect } from "react";

// Breakpoint values in pixels
const BREAKPOINTS = {
  mobile: 640,  // sm
  tablet: 1024, // md-lg
  desktop: 1280 // xl
};

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile);
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
      setIsTablet(width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop);
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
  
  return { isMobile, isTablet, isDesktop };
}
