import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { radii, spacing, useColors } from '../theme';
import { Text } from './Text';

export type InfoModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: string[];
};

/**
 * Simple informational modal with a title, a numbered list of items,
 * and a close button. Used to explain field labels (e.g. liabilities).
 */
export function InfoModal({ visible, onClose, title, items }: InfoModalProps) {
  const c = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Scrim — tap outside to dismiss */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Inner Pressable stops taps on the card from closing the modal */}
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
          onPress={() => {}}
        >
          {/* Title */}
          <Text variant="title" style={{ color: c.text, textAlign: 'center' }}>
            {title}
          </Text>

          <View style={[styles.divider, { backgroundColor: c.divider }]} />

          {/* Numbered items */}
          {items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text
                variant="body"
                style={[styles.number, { color: c.secondary }]}
              >
                {index + 1}.
              </Text>
              <Text variant="body" style={[styles.itemText, { color: c.text }]}>
                {item}
              </Text>
            </View>
          ))}

          <View style={[styles.divider, { backgroundColor: c.divider }]} />

          {/* Close button */}
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.closeButton,
              { backgroundColor: c.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text variant="label" style={{ color: c.onPrimary }}>
              ✕
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  divider: {
    height: 1,
    borderRadius: 1,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  number: {
    minWidth: 20,
    textAlign: 'left',
  },
  itemText: {
    flex: 1,
    writingDirection: 'rtl',
  },
  closeButton: {
    alignSelf: 'center',
    borderRadius: radii.pill,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
