
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    // Custom resources type
    resources: {
      translation: typeof import('../i18n/locales/en.json');
    };
    // Force all components to accept React nodes to avoid type conflicts
    react: {
      transSupportBasicHtmlNodes: boolean;
      transKeepBasicHtmlNodesFor: string[];
    };
    // Return type for the t function to be compatible with ReactNode
    returnEmptyString: false;
    returnObjects: false;
    returnNull: false;
    defaultNS: 'translation';
  }
}

// Make ReactNode include ReactI18NextChildren for better type compatibility
declare global {
  namespace React {
    // Extend ReactNode to include ReactI18NextChildren
    type ReactNode = ReactI18NextChildren | Iterable<ReactI18NextChildren> | import('react').ReactNode;
  }
}

// Ensure that built-in JSX elements accept string literals
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Ensure all intrinsic elements accept string children
      [key: string]: any;
    }
  }
}
