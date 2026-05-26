import { Text as RNText } from 'react-native';
import type { TextProps as RNTextProps } from 'react-native';

import type { TypographyVariant } from '../theme';
import { useWidgetStyles } from '../styles/widgets';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
};

export function Text({ variant = 'body', style, ...rest }: TextProps) {
  const s = useWidgetStyles();
  return <RNText {...rest} style={[s.text[variant], style]} />;
}
