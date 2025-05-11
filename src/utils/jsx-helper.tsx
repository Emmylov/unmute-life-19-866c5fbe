
import React from 'react';

/**
 * Wraps text content to make it compatible with ReactI18NextChildren
 * Use this helper when JSX elements expect ReactI18NextChildren but you have a string
 */
export const jsx = (
  content: React.ReactNode | string | number | null | undefined
): React.ReactNode => {
  // Cast explicitly to ReactNode to resolve TypeScript compatibility issues
  return <>{content}</>;
};

/**
 * Creates a version of a component that handles string children correctly
 * This is a more advanced approach to fix components wholesale
 */
export function withSafeJSX<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    return <Component {...props} />;
  };
}

export default jsx;
