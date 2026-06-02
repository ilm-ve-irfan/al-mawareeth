import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import {
  WelcomeScreen,
  DeceasedInfoScreen,
  FamilyDetailsScreen,
  SummaryScreen,
} from '../screens';
import { useColors } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const colors = useColors();
  const { t } = useTranslation('form');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.onPrimary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeceasedInfo"
        component={DeceasedInfoScreen}
        options={{ title: t('deceased.title') }}
      />
      <Stack.Screen
        name="FamilyDetails"
        component={FamilyDetailsScreen}
        options={{ title: t('family.title') }}
      />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
        options={{ title: t('summary.title') }}
      />
    </Stack.Navigator>
  );
}
