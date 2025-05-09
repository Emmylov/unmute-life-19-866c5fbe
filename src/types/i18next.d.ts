
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

// This critical type declaration fixes the compatibility between ReactI18NextChildren and ReactNode
declare module 'react' {
  interface ReactI18NextChildren extends ReactNode {}
}
