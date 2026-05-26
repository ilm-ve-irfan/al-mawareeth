import { I18nManager, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import i18n from 'i18next';

export const STORE_LANGUAGE_KEY = 'settings.lang';

export const ensureRTL = async (lng: string) => {
  const shouldRTL = i18n.dir(lng) === 'rtl';

  if (I18nManager.isRTL !== shouldRTL) {
    I18nManager.allowRTL(shouldRTL);
    I18nManager.forceRTL(shouldRTL);

    if (__DEV__) {
      NativeModules.DevSettings.reload();
    } else {
      await Updates.reloadAsync();
    }
  }
};

export const changeLanguage = async (newLang: 'en' | 'ar') => {
  try {
    await AsyncStorage.setItem(STORE_LANGUAGE_KEY, newLang);

    const isRTL = i18n.dir(newLang) === 'rtl';

    if (I18nManager.isRTL !== isRTL) {
      await ensureRTL(newLang);
    } else {
      i18n.changeLanguage(newLang);
    }
  } catch (error) {
    console.error('Error changing language:', error);
  }
};
