import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { LanguageDetectorAsyncModule } from 'i18next';

const STORE_LANGUAGE_KEY = 'settings.lang';

export const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async function () {
    try {
      const savedDataJSON = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      const lng = savedDataJSON ? savedDataJSON : null;

      if (lng) {
        return lng;
      }

      const deviceLang = getLocales()[0]?.languageCode || 'en';

      return deviceLang;
    } catch (error) {
      console.error('Error reading language from storage:', error);
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
