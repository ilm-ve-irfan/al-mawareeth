import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, I18nManager, StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { changeLanguage } from './src/utils/language';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { t, i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleInit = () => {
      setIsReady(true);
    };

    if (i18n.isInitialized) {
      handleInit();
    } else {
      i18n.on('initialized', handleInit);
    }

    return () => {
      i18n.off('initialized', handleInit);
    };
  }, [i18n]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  const otherLang = i18n.language === 'en' ? 'ar' : 'en';

  return (
    <View style={styles.container}>
      <Text>{t('welcome')}</Text>
      <StatusBar style="auto" />

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <SwitchLanguageButton lang={otherLang} />
      </View>
      <Text>{I18nManager.isRTL ? 'RTL enabled' : 'RTL disabled'}</Text>
    </View>
  );
}

const SwitchLanguageButton = ({ lang }: { lang: 'en' | 'ar' }) => {
  const { t } = useTranslation(['settings']);

  return (
    <Button
      title={t('switch_lang', {
        lang: t(`languages.${lang}`),
      })}
      onPress={() => changeLanguage(lang)}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 10,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
