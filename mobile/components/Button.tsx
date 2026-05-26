import { Pressable, Text } from 'react-native';
import type { PressableProps } from 'react-native';

import { useWidgetStyles } from '../styles/widgets';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
};

export function Button({ label, variant = 'primary', disabled, ...rest }: ButtonProps) {
  const s = useWidgetStyles();
  const labelStyle = {
    primary: s.button.labelPrimary,
    secondary: s.button.labelSecondary,
    ghost: s.button.labelGhost,
  }[variant];

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        s.button.base,
        s.button[variant],
        disabled && s.button.disabled,
        pressed && !disabled && s.button.pressed,
      ]}
    >
      <Text style={labelStyle}>{label}</Text>
    </Pressable>
  );
}
