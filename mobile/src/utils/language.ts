import { I18nManager, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import i18n from 'i18next';

export const STORE_LANGUAGE_KEY = 'settings.lang';

export const ensureRTL = (lng: string) => {
  const shouldRTL = i18n.dir(lng) === 'rtl';
  I18nManager.allowRTL(shouldRTL);
  I18nManager.forceRTL(shouldRTL);
};

export const changeLanguage = async (newLang: 'en' | 'ar') => {
  try {
    const currentLang = i18n.resolvedLanguage ?? i18n.language ?? 'en';
    const shouldRTL = i18n.dir(newLang) === 'rtl';
    const isCurrentlyRTL = i18n.dir(currentLang) === 'rtl';

    await AsyncStorage.setItem(STORE_LANGUAGE_KEY, newLang);

    if (shouldRTL !== isCurrentlyRTL) {
      ensureRTL(newLang);
      if (__DEV__) {
        NativeModules.DevSettings.reload();
      } else {
        await Updates.reloadAsync();
      }
      return;
    }

    await i18n.changeLanguage(newLang);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};
