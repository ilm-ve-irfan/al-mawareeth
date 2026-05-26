import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { LanguageDetectorAsyncModule } from 'i18next';
import { ensureRTL } from '../utils/language';

const STORE_LANGUAGE_KEY = 'settings.lang';

export const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async function () {
    try {
      const savedDataJSON = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      const lang = savedDataJSON ? savedDataJSON : null;
      const deviceLang = getLocales()[0]?.languageCode || 'en';
      const lng = lang ?? deviceLang;

      await ensureRTL(lng);

      return lng;
    } catch (error) {
      console.error('Error reading language from storage:', error);
      await ensureRTL('en');
      return 'en';
    }
  },
  cacheUserLanguage: async function (lng: string) {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, lng);
    } catch (error) {
      console.error('Error saving language to storage:', error);
    }
  },
};
