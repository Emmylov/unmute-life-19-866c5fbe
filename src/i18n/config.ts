
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translations
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';

// Initialize i18next with enhanced settings compatible with React 18
i18n
  .use(LanguageDetector)
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
      useSuspense: false, // Critical to avoid issues with React 18
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button']
    },
    // Additional settings to ensure compatibility
    compatibilityJSON: 'v3'
  });

export default i18n;
