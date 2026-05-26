import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './locales';

const deviceLanguage = getLocales()[0].languageCode ?? 'en';

i18n.use(initReactI18next).init({
  enableSelector: true,
  defaultNS: 'common',
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ar'],
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
