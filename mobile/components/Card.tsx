import { View } from 'react-native';
import type { ViewProps } from 'react-native';

import { useWidgetStyles } from '../styles/widgets';

export function Card({ style, children, ...rest }: ViewProps) {
  const s = useWidgetStyles();
  return (
    <View {...rest} style={[s.card.base, style]}>
      {children}
    </View>
  );
}
