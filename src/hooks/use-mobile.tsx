
import { useIsMobile as useResponsiveMobile } from './use-responsive';

/**
 * Hook for detecting if the current device is mobile
 * This is a wrapper around useIsMobile from use-responsive for backward compatibility
 */
export function useIsMobile() {
  return useResponsiveMobile();
}

export default useIsMobile;
