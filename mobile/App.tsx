import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

import { Button, Card, Text, TextField } from './components';
import { spacing, useColors } from './theme';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from './src/utils/language';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colors = useColors();
  const scheme = useColorScheme() ?? 'light';
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);
  const { i18n, t } = useTranslation('theme');

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

  const handleSubmit = () => {
    setError(name.trim() ? undefined : t('input.full_name_error'));
  };

  const targetLang = i18n.language === 'en' ? 'ar' : 'en';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text variant="display">{t('app.title')}</Text>
          <Text variant="caption">{t('app.caption')}</Text>
        </View>

        <Card>
          <SwitchLanguageButton lang={targetLang} />
        </Card>

        <Card>
          <Text variant="title">{t('sections.buttons')}</Text>
          <View style={styles.row}>
            <Button label={t('buttons.primary')} onPress={handleSubmit} />
            <Button label={t('buttons.secondary')} variant="secondary" onPress={handleSubmit} />
            <Button label={t('buttons.ghost')} variant="ghost" onPress={handleSubmit} />
          </View>
          <Button label={t('buttons.disabled')} disabled />
        </Card>

        <Card>
          <Text variant="title">{t('sections.input')}</Text>
          <TextField
            label={t('input.full_name_label')}
            placeholder={t('input.full_name_placeholder')}
            value={name}
            onChangeText={setName}
            error={error}
            autoCapitalize="words"
          />
          <Button label={t('buttons.validate')} onPress={handleSubmit} />
        </Card>

        <Card>
          <Text variant="title">{t('sections.typography')}</Text>
          <Text variant="display">{t('typography.display')}</Text>
          <Text variant="title">{t('typography.title')}</Text>
          <Text variant="body">{t('typography.body')}</Text>
          <Text variant="caption">{t('typography.caption')}</Text>
          <Text variant="label">{t('typography.label')}</Text>
        </Card>

        <Card>
          <Text variant="title">{t('sections.theme')}</Text>
          <Text>{t('scheme.active', { scheme: t(`scheme.${scheme}`) })}</Text>
        </Card>
      </ScrollView>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

const SwitchLanguageButton = ({ lang }: { lang: 'en' | 'ar' }) => {
  const { t } = useTranslation(['settings']);

  return (
    <Button
      label={t('switch_lang', {
        lang: t(`languages.${lang}`),
      })}
      onPress={() => changeLanguage(lang)}
    />
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xxxl + spacing.lg,
    gap: spacing.lg,
  },
  header: { gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
});
