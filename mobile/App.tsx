import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { useColors } from './theme';

export default function App() {
  const colors = useColors();
  const scheme = useColorScheme() ?? 'light';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>المواريث</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Al Mawareeth
      </Text>
      <View
        style={[
          styles.accent,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.secondary,
          },
        ]}
      >
        <Text style={{ color: colors.text }}>
          Theme: {scheme === 'dark' ? 'Dark' : 'Light'}
        </Text>
      </View>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 1,
  },
  accent: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
});
