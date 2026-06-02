import { useRef, useState } from 'react';
import type { ElementRef } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';

import { spacing } from '../theme';
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

// Rough per-row height, used ONLY to decide whether the menu opens downward
// or flips upward near the screen edge. The menu is sized by its content and
// capped by the measured available space.
const ROW_ESTIMATE = 48;

type Anchor = { x: number; y: number; width: number; height: number };

/**
 * Dropdown / picker. The trigger shows the current label; tapping opens an
 * anchored menu directly beneath the trigger (it flips above when there is
 * no room below). Tapping the backdrop or an option closes it. No dark scrim
 * is used so the only colors come from theme tokens.
 */
export function Select<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SelectProps<T>) {
  const s = useWidgetStyles();
  const { height: windowHeight } = useWindowDimensions();
  const triggerRef = useRef<ElementRef<typeof View>>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const selected = options.find((o) => o.value === value);

  const openMenu = () => {
    // Measure the trigger in window coordinates so the menu can sit right
    // beneath it (the Modal also covers the full window, so they align).
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  };

  // Position the menu from the measured anchor: under the trigger by
  // default, flipped above it when the bottom edge is too close.
  const menuStyle = (() => {
    if (!anchor) return null;
    const gap = spacing.xs;
    const spaceBelow = windowHeight - (anchor.y + anchor.height);
    const desired = options.length * ROW_ESTIMATE + spacing.sm;
    const openUp = spaceBelow < desired && anchor.y > spaceBelow;

    return openUp
      ? {
          left: anchor.x,
          width: anchor.width,
          bottom: windowHeight - anchor.y + gap,
          maxHeight: Math.max(0, anchor.y - gap - spacing.lg),
        }
      : {
          left: anchor.x,
          width: anchor.width,
          top: anchor.y + anchor.height + gap,
          maxHeight: Math.max(0, spaceBelow - gap - spacing.lg),
        };
  })();

  return (
    <View>
      <Pressable
        ref={triggerRef}
        onPress={openMenu}
        accessibilityRole="combobox"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: selected?.label }}
        style={s.select.trigger}
      >
        <Text style={s.select.triggerLabel}>{selected?.label ?? ''}</Text>
        <Text style={s.select.chevron}>{open ? '▴' : '▾'}</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* Full-window catcher: a tap outside the menu closes it. */}
        <Pressable style={s.select.backdrop} onPress={() => setOpen(false)} />

        {/* Anchored menu. Sits on top of the backdrop; taps on its padding
            are absorbed here and do not fall through to the backdrop. */}
        {menuStyle ? (
          <View style={[s.select.menu, menuStyle]}>
            <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
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
                      <Text
                        style={[s.select.optionLabel, s.select.optionSelected]}
                      >
                        ✓
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
      </Modal>
    </View>
  );
}
