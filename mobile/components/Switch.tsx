import { Switch as RNSwitch } from 'react-native';
import type { SwitchProps as RNSwitchProps } from 'react-native';

import { useColors } from '../theme';

export type SwitchProps = RNSwitchProps;

/**
 * Themed wrapper around React Native's native Switch so on/off colors
 * follow the active color scheme. Use for yes/no toggles (e.g. wasiya).
 */
export function Switch(props: SwitchProps) {
  const c = useColors();

  return (
    <RNSwitch
      trackColor={{ false: c.border, true: c.primary }}
      thumbColor={c.surface}
      ios_backgroundColor={c.border}
      {...props}
    />
  );
}
