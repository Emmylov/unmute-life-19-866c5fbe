
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

// Fix the type compatibility issue between JSX text nodes and ReactI18NextChildren
declare module 'react' {
  // Make ReactI18NextChildren extend ReactNode to ensure compatibility
  interface ReactI18NextChildren extends ReactNode {}
  
  // Ensure ReactNode includes ReactI18NextChildren
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    props: P & { children?: ReactNode | ReactI18NextChildren | Iterable<ReactI18NextChildren> };
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

// Make ReactNode compatible with ReactI18NextChildren
declare global {
  namespace React {
    interface ReactElement {
      props: {
        children?: ReactNode | ReactI18NextChildren | Iterable<ReactI18NextChildren>;
      } & any;
    }
  }
}
