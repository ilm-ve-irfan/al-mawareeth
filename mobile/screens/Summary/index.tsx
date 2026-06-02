import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, Card, Text } from '../../components';
import { spacing, useColors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Summary'>;

export default function SummaryScreen({ navigation }: Props) {
  const colors = useColors();
  const { t } = useTranslation('form');

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Card>
        <Text variant="title">{t('summary.title')}</Text>
        <Text variant="body">{t('summary.subtitle')}</Text>
      </Card>

      <Button label={t('actions.finish')} onPress={() => navigation.popToTop()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
});
