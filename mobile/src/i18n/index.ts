import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './locales';
import { languageDetector } from './language-detector';

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    defaultNS: 'common',
    ns: ['common', 'settings', 'theme'],
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
