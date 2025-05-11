
import React from 'react';

interface TextWrapperProps {
  text: string | number | null | undefined;
}

/**
 * A simple component that wraps text to make it compatible with
 * React components that expect ReactI18NextChildren
 */
const TextWrapper: React.FC<TextWrapperProps> = ({ text }) => {
  // This simple fragment ensures proper text rendering and type compatibility
  return <>{text}</>;
};

export default TextWrapper;
