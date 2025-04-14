
import { toast } from "sonner";
import { checkSessionValid, refreshSession } from "@/services/auth-service";

interface ErrorWithMessage {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Type guard to check if an error has a message property
 */
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Extracts a message from an unknown error
 */
function toErrorWithMessage(error: unknown): ErrorWithMessage {
  if (isErrorWithMessage(error)) {
    return error;
  }

  try {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return new Error(errorMessage);
  } catch {
    // fallback in case there's an error stringifying the error
    return new Error(String(error));
  }
}

/**
 * Gets a user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

/**
 * Check if the error is related to authentication
 */
export function isAuthError(error: unknown): boolean {
  if (!error) return false;
  
  const processedError = toErrorWithMessage(error);
  const message = processedError.message.toLowerCase();
  const status = processedError.status;
  const code = processedError.code;
  
  // Check common auth error patterns
  return (
    status === 401 || 
    status === 403 ||
    code === 'PGRST301' ||  // JWT expired
    code === 'PGRST401' ||  // JWT invalid
    message.includes('jwt') ||
    message.includes('token') ||
    message.includes('auth') ||
    message.includes('permission') ||
    message.includes('unauthorized') ||
    message.includes('not allowed') ||
    message.includes('forbidden') ||
    message.includes('expired')
  );
}

/**
 * Handle API errors and show appropriate toast notifications
 */
export const handleApiError = async (error: unknown, customMessage?: string): Promise<void> => {
  console.error("API Error:", error);
  
  const errorMessage = getErrorMessage(error);
  
  // Check if this is an authentication error
  if (isAuthError(error)) {
    // Try to refresh the session
    const isValid = await checkSessionValid();
    if (!isValid) {
      const refreshed = await refreshSession();
      if (!refreshed) {
        // If refresh failed, show auth error
        toast.error("Authentication error", {
          description: "Your session has expired. Please log in again."
        });
        
        // Could trigger a redirect to login page here
        return;
      }
    }
  }
  
  toast.error(customMessage || "Something went wrong", {
    description: errorMessage || "Please try again or contact support if the problem persists."
  });
};

/**
 * General async handler with automatic error handling
 * @param asyncFn The async function to execute
 * @param errorMessage Optional custom error message
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  errorMessage?: string
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await asyncFn();
    return { data, error: null };
  } catch (error) {
    const processedError = error instanceof Error ? error : new Error(getErrorMessage(error));
    await handleApiError(processedError, errorMessage);
    return { data: null, error: processedError };
  }
}

/**
 * Helper to handle network/fetch errors gracefully
 * @param promise The fetch or API call promise
 * @param timeout Optional timeout in milliseconds
 */
export function withTimeout<T>(promise: Promise<T>, timeout = 30000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${timeout}ms`));
    }, timeout);
  });

  return Promise.race([promise, timeoutPromise]) as Promise<T>;
}
