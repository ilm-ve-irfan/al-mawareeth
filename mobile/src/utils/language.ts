import { I18nManager, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import i18n from '../i18n';

export const STORE_LANGUAGE_KEY = 'settings.lang';

export const changeLanguage = async (newLang: 'en' | 'ar') => {
  try {
    await AsyncStorage.setItem(STORE_LANGUAGE_KEY, newLang);

    const isRTL = i18n.dir(newLang) === 'rtl';

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);

      if (__DEV__) {
        NativeModules.DevSettings.reload();
      } else {
        await Updates.reloadAsync();
      }
    } else {
      i18n.changeLanguage(newLang);
    }
  } catch (error) {
    console.error('Error changing language:', error);
  }
};
