import { Pressable, View } from 'react-native';

import { useWidgetStyles } from '../styles/widgets';
import { Text } from './Text';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

export type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * Two-or-more way single-choice toggle (e.g. gender ذكر / أنثى).
 * Row direction auto-flips under I18nManager.isRTL.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const s = useWidgetStyles();

  return (
    <View style={s.segmented.container} accessibilityRole="radiogroup">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            style={[s.segmented.option, active && s.segmented.optionActive]}
          >
            <Text style={active ? s.segmented.labelActive : s.segmented.label}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
