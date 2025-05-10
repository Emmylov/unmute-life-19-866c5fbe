
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translations
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';

// Initialize i18next with settings compatible with React 18
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      fr: {
        translation: frTranslations
      },
      es: {
        translation: esTranslations
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    // Enhanced compatibility settings for React 18
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span', 'em'],
      useSuspense: false, // Critical to avoid issues with React 18
      transWrapTextNodes: ''  // Using empty string instead of null/undefined
    },
    // Additional settings to ensure compatibility
    compatibilityJSON: 'v3',
    skipOnVariables: false
  });

export default i18n;
