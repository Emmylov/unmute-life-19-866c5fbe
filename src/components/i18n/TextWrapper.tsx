
import React from 'react';

interface TextWrapperProps {
  text: string | number | null | undefined;
}

/**
 * A simple component that wraps text to make it compatible with
 * React components that expect ReactI18NextChildren
 */
const TextWrapper: React.FC<TextWrapperProps> = ({ text }) => {
  // Explicitly cast as React.ReactNode to ensure type compatibility
  return <>{text}</>;
};

export default TextWrapper;
