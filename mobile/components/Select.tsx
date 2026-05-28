import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { useWidgetStyles } from '../styles/widgets';
import { Text } from './Text';

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

export type SelectProps<T extends string> = {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
};

/**
 * Dropdown / picker. The trigger shows the current label; tapping opens a
 * bottom sheet with the options. Tapping the backdrop or an option closes
 * it. No dark scrim is used so the only colors come from theme tokens.
 */
export function Select<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SelectProps<T>) {
  const s = useWidgetStyles();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="combobox"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: selected?.label }}
        style={s.select.trigger}
      >
        <Text style={s.select.triggerLabel}>{selected?.label ?? ''}</Text>
        <Text style={s.select.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={s.select.backdrop} onPress={() => setOpen(false)}>
          {/* Inner Pressable captures taps so they don't close the sheet. */}
          <Pressable style={s.select.sheet} onPress={() => undefined}>
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: active }}
                  style={s.select.option}
                >
                  <Text style={s.select.optionLabel}>{opt.label}</Text>
                  {active ? (
                    <Text style={[s.select.optionLabel, s.select.optionSelected]}>
                      ✓
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
