
import { toast as toastFunction } from "sonner";

// Re-export the toast function from sonner
export { toastFunction as toast };

// For compatibility with existing code that expects useToast, 
// we'll create a simple wrapper that returns the toast function
export const useToast = () => {
  return {
    toast: toastFunction
  };
};
