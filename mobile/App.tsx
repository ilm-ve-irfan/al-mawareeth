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
  const { i18n } = useTranslation();

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
    setError(name.trim() ? undefined : 'Full name is required');
  };

  const targetLang = i18n.language === 'en' ? 'ar' : 'en';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text variant="display">المواريث</Text>
          <Text variant="caption">Al Mawareeth — Widget Showcase</Text>
        </View>

        <Card>
          <SwitchLanguageButton lang={targetLang} />
        </Card>

        <Card>
          <Text variant="title">Buttons</Text>
          <View style={styles.row}>
            <Button label="Primary" onPress={handleSubmit} />
            <Button label="Secondary" variant="secondary" onPress={handleSubmit} />
            <Button label="Ghost" variant="ghost" onPress={handleSubmit} />
          </View>
          <Button label="Disabled" disabled />
        </Card>

        <Card>
          <Text variant="title">Input</Text>
          <TextField
            label="Full name"
            placeholder="e.g. Khaled"
            value={name}
            onChangeText={setName}
            error={error}
            autoCapitalize="words"
          />
          <Button label="Validate" onPress={handleSubmit} />
        </Card>

        <Card>
          <Text variant="title">Typography</Text>
          <Text variant="display">Display</Text>
          <Text variant="title">Title</Text>
          <Text variant="body">Body — the default for most prose.</Text>
          <Text variant="caption">Caption — for secondary information.</Text>
          <Text variant="label">Label — for form labels and chips.</Text>
        </Card>

        <Card>
          <Text variant="title">Theme</Text>
          <Text>Active scheme: {scheme === 'dark' ? 'Dark' : 'Light'}</Text>
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
