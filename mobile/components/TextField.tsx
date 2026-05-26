import { TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import { useWidgetStyles } from '../styles/widgets';
import { useColors } from '../theme';
import { Text } from './Text';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function TextField({
  label,
  error,
  style,
  ...rest
}: TextFieldProps) {
  const s = useWidgetStyles();
  const c = useColors();

  return (
    <View style={s.input.wrapper}>
      {label ? <Text variant="label">{label}</Text> : null}
      <TextInput
        {...rest}
        placeholderTextColor={c.textMuted}
        style={[s.input.field, error ? s.input.fieldError : null, style]}
      />
      {error ? <Text style={s.input.error}>{error}</Text> : null}
    </View>
  );
}
