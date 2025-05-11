
import React from 'react';
import TextWrapper from '@/components/i18n/TextWrapper';

/**
 * A utility hook that provides functions to safely render text in JSX
 * when dealing with i18next type compatibility issues
 */
export const useSafeText = () => {
  /**
   * Wraps text in a TextWrapper component to ensure type compatibility with ReactI18NextChildren
   */
  const safeText = (text: string | number | null | undefined) => {
    // Cast directly to ReactNode to resolve type issues
    return <TextWrapper text={text} />;
  };

  return { safeText };
};

export default useSafeText;
