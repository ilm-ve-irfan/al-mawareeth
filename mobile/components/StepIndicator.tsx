import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useWidgetStyles } from '../styles/widgets';
import { Text } from './Text';

export type StepIndicatorProps = {
  /** 1-based index of the active step. */
  current: number;
  /** Total number of steps in the flow. */
  total: number;
  /** Render the segmented bar only, without the "Step X of Y" caption. */
  hideLabel?: boolean;
};

/**
 * Segmented progress bar for the multi-step inheritance form.
 *
 * Renders one pill segment per step (completed → primary, current →
 * secondary/gold for emphasis, upcoming → muted) plus a localized
 * "Step {{current}} of {{total}}" caption from the `form` namespace.
 */
export function StepIndicator({
  current,
  total,
  hideLabel = false,
}: StepIndicatorProps) {
  const s = useWidgetStyles();
  const { t } = useTranslation('form');

  // Guard against out-of-range / fractional input from callers.
  const safeTotal = Math.max(1, Math.floor(total));
  const safeCurrent = Math.min(Math.max(1, Math.floor(current)), safeTotal);

  const label = t('step', { current: safeCurrent, total: safeTotal });

  return (
    <View style={s.progress.container}>
      {hideLabel ? null : <Text variant="caption">{label}</Text>}
      <View
        // `flexDirection: 'row'` auto-flips under I18nManager.isRTL, so the
        // bar fills from the right in Arabic with no extra handling.
        style={s.progress.track}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: safeTotal, now: safeCurrent }}
        accessibilityLabel={label}
      >
        {Array.from({ length: safeTotal }, (_, i) => {
          const stepNo = i + 1;
          const isDone = stepNo < safeCurrent;
          const isCurrent = stepNo === safeCurrent;
          return (
            <View
              key={stepNo}
              style={[
                s.progress.segment,
                isDone && s.progress.segmentDone,
                isCurrent && s.progress.segmentCurrent,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}
