import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, Card, SegmentedControl, Text } from '../../components';
import { radii, spacing, useColors } from '../../theme';
import { changeLanguage } from '../../src/utils/language';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

type Lang = 'ar' | 'en';

export default function WelcomeScreen({ navigation }: Props) {
  const c = useColors();
  const { t, i18n } = useTranslation('form');

  const current: Lang = i18n.resolvedLanguage === 'ar' ? 'ar' : 'en';

  const languageOptions = [
    { value: 'ar' as Lang, label: t('lang.ar') },
    { value: 'en' as Lang, label: t('lang.en') },
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo already contains the wordmark + subtitle, so no extra text.
            Height-bounded + contain so it never overflows or gets cropped. */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Card style={styles.card}>
          <Text variant="display" style={[styles.icon, { color: c.secondary }]}>
            ⚖
          </Text>
          <Text variant="title" style={styles.center}>
            {t('welcome.title')}
          </Text>
          <Text variant="caption" style={styles.center}>
            {t('welcome.brand')}
          </Text>

          <View style={[styles.divider, { backgroundColor: c.divider }]} />

          <Text variant="label" style={styles.center}>
            {t('welcome.chooseLanguage')}
          </Text>
          <SegmentedControl
            options={languageOptions}
            value={current}
            onChange={(lng) => {
              changeLanguage(lng);
            }}
          />
        </Card>

        <View style={[styles.basmala, { backgroundColor: c.surfaceVariant }]}>
          <Text variant="body" style={[styles.center, { color: c.textMuted }]}>
            {t('welcome.basmala')}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            label={t('welcome.start')}
            onPress={() => navigation.navigate('DeceasedInfo')}
          />
          <Button
            label={t('welcome.moreInfo')}
            variant="ghost"
            onPress={() => {
              // TODO: navigate to the info/about screen once it exists.
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.xl,
  },
  center: { textAlign: 'center' },
  // Bounded height keeps the logo from overflowing; contain prevents cropping.
  logo: { width: '100%', height: spacing.xxxl * 4.75, alignSelf: 'center' },
  card: { alignItems: 'stretch', gap: spacing.sm },
  icon: { textAlign: 'center' },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: spacing.sm,
  },
  basmala: {
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  actions: { gap: spacing.sm },
});
