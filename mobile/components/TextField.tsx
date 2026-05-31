import { TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import { useWidgetStyles } from '../styles/widgets';
import { useColors } from '../theme';
import { Text } from './Text';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  // Optional validity adornment shown at the trailing edge of the field:
  //   true      -> success check (✓)
  //   false     -> error mark (✗)
  //   undefined -> no adornment (neutral / untouched)
  valid?: boolean;
};

export function TextField({
  label,
  error,
  valid,
  style,
  ...rest
}: TextFieldProps) {
  const s = useWidgetStyles();
  const c = useColors();

  // The box border turns red on an explicit error or an invalid value.
  const invalid = error != null || valid === false;

  return (
    <View style={s.input.wrapper}>
      {label ? <Text variant="label">{label}</Text> : null}

      {/* Bordered box wraps the input + the status icon so the ✓/✗ sits
          inside the field. flexDirection 'row' mirrors under RTL. */}
      <View style={[s.input.box, invalid ? s.input.boxError : null]}>
        <TextInput
          {...rest}
          placeholderTextColor={c.textMuted}
          style={[s.input.control, style]}
        />
        {valid === true ? (
          <Text style={[s.input.adornment, s.input.adornmentOk]}>✓</Text>
        ) : null}
        {valid === false ? (
          <Text style={[s.input.adornment, s.input.adornmentBad]}>✗</Text>
        ) : null}
      </View>

      {error ? <Text style={s.input.error}>{error}</Text> : null}
    </View>
  );
}
