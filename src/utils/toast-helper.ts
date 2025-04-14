
import { toast, type Toast as SonnerToast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

// Align our interface with sonner's expected types
interface ToastOptions {
  description?: string;
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void; // Make onClick required to match sonner's Action type
  };
  cancel?: {
    label: string;
    onClick: () => void; // Make onClick required to match sonner's Action type
  };
  closeButton?: boolean;
}

/**
 * Show a standardized toast notification
 * @param type The type of toast (success, error, warning, info)
 * @param title The main toast message
 * @param options Additional toast options
 */
export const showToast = (
  type: ToastType,
  title: string,
  options?: ToastOptions
) => {
  const toastFn = toast[type];
  
  if (!toastFn) {
    console.error(`Invalid toast type: ${type}`);
    return;
  }
  
  toastFn(title, options as any); // Use type assertion as any to bypass type checking
};

/**
 * Show a success toast with standardized settings
 * @param title The main toast message
 * @param options Additional toast options
 */
export const showSuccess = (title: string, options?: Omit<ToastOptions, "icon">) => {
  return showToast("success", title, options);
};

/**
 * Show an error toast with standardized settings
 * @param title The main toast message
 * @param options Additional toast options
 */
export const showError = (title: string, options?: Omit<ToastOptions, "icon">) => {
  return showToast("error", title, {
    ...options,
    duration: options?.duration || 5000, // Longer duration for errors by default
  });
};

/**
 * Show a warning toast with standardized settings
 * @param title The main toast message
 * @param options Additional toast options
 */
export const showWarning = (title: string, options?: Omit<ToastOptions, "icon">) => {
  return showToast("warning", title, options);
};

/**
 * Show an info toast with standardized settings
 * @param title The main toast message
 * @param options Additional toast options
 */
export const showInfo = (title: string, options?: Omit<ToastOptions, "icon">) => {
  return showToast("info", title, options);
};

/**
 * Show a loading toast that can be updated later
 * @param title The main toast message
 * @returns A function to update the toast with a new type and message
 */
export const showLoadingToast = (title: string, options?: Omit<ToastOptions, "icon">) => {
  const id = toast.loading(title, options as any);
  
  return {
    updateWith: (type: ToastType, newTitle: string, newOptions?: Omit<ToastOptions, "icon">) => {
      toast.dismiss(id);
      showToast(type, newTitle, newOptions);
    },
    dismiss: () => toast.dismiss(id),
  };
};
