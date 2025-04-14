
import { toast } from "sonner";

interface ErrorWithMessage {
  message: string;
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
 * Handle API errors and show appropriate toast notifications
 */
export const handleApiError = (error: unknown, customMessage?: string): void => {
  console.error("API Error:", error);
  
  const errorMessage = getErrorMessage(error);
  
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
    handleApiError(processedError, errorMessage);
    return { data: null, error: processedError };
  }
}
