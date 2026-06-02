// Central widget StyleSheet. Components must consume styles through
// useWidgetStyles() so layout, radii, and typography stay in sync with
// the design tokens and the active color scheme.
//
// See ./README.md for naming conventions and how to add a new widget.

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { radii, spacing, typography, useColors } from '../theme';

export function useWidgetStyles() {
  const c = useColors();

  return useMemo(
    () => ({
      button: StyleSheet.create({
        base: {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderRadius: radii.md,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
          minHeight: 44,
        },
        primary: { backgroundColor: c.primary },
        secondary: { backgroundColor: c.secondary },
        ghost: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: c.border,
        },
        disabled: { opacity: 0.5 },
        pressed: { opacity: 0.85 },
        labelPrimary: { ...typography.label, color: c.onPrimary },
        labelSecondary: { ...typography.label, color: c.onSecondary },
        labelGhost: { ...typography.label, color: c.primary },
      }),

      card: StyleSheet.create({
        base: {
          backgroundColor: c.surface,
          borderRadius: radii.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: c.border,
          gap: spacing.sm,
        },
      }),

      input: StyleSheet.create({
        wrapper: { gap: spacing.xs },
        label: { ...typography.label, color: c.textMuted },
        // The box carries the border so the trailing ✓/✗ icon sits inside
        // the field; the control is the bare TextInput.
        box: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          backgroundColor: c.surface,
          borderColor: c.border,
          borderWidth: 1,
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          minHeight: 44,
        },
        boxError: { borderColor: c.error },
        control: {
          ...typography.body,
          color: c.text,
          flex: 1,
          paddingVertical: spacing.sm,
        },
        adornment: { ...typography.body },
        adornmentOk: { color: c.success },
        adornmentBad: { color: c.error },
        error: { ...typography.caption, color: c.error },
      }),

      text: StyleSheet.create({
        display: { ...typography.display, color: c.text },
        title: { ...typography.title, color: c.text },
        body: { ...typography.body, color: c.text },
        caption: { ...typography.caption, color: c.textMuted },
        label: { ...typography.label, color: c.textMuted },
      }),

      progress: StyleSheet.create({
        container: { gap: spacing.sm },
        track: {
          flexDirection: 'row',
          gap: spacing.xs,
        },
        segment: {
          flex: 1,
          height: spacing.xs,
          borderRadius: radii.pill,
          backgroundColor: c.surfaceVariant,
        },
        segmentDone: { backgroundColor: c.primary },
        segmentCurrent: { backgroundColor: c.secondary },
      }),

      segmented: StyleSheet.create({
        container: {
          flexDirection: 'row',
          backgroundColor: c.surfaceVariant,
          borderRadius: radii.md,
          padding: spacing.xs,
          gap: spacing.xs,
        },
        option: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing.sm,
          borderRadius: radii.sm,
          minHeight: 44,
        },
        optionActive: { backgroundColor: c.primary },
        label: { ...typography.label, color: c.text },
        labelActive: { ...typography.label, color: c.onPrimary },
      }),

      // Dropdown / picker. The menu is positioned at runtime (top/left/width
      // come from measuring the trigger), so only theming lives here.
      select: StyleSheet.create({
        trigger: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
          minHeight: 44,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: radii.md,
          backgroundColor: c.surface,
        },
        triggerLabel: { ...typography.body, color: c.text },
        triggerDisabled: { opacity: 0.5 },
        chevron: { ...typography.caption, color: c.textMuted },
        // Transparent full-window catcher: a tap anywhere outside closes.
        backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        // Anchored, floating menu placed beneath (or above) the trigger.
        menu: {
          position: 'absolute',
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: radii.md,
          paddingVertical: spacing.xs,
          overflow: 'hidden',
          // Float above page content: elevation on Android, shadow on iOS.
          elevation: 6,
          shadowColor: '#000000',
          shadowOpacity: 0.18,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        },
        option: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          minHeight: 44,
        },
        optionLabel: { ...typography.body, color: c.text },
        optionSelected: { color: c.secondary },
      }),

      // Read-only recap on the summary screen (screen 04). Row directions
      // flip automatically under RTL, so author them in logical order.
      summary: StyleSheet.create({
        // Two status cards sitting side by side (estate vs debts).
        statsRow: { flexDirection: 'row', gap: spacing.md },
        statCard: {
          flex: 1,
          borderRadius: radii.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: c.border,
          gap: spacing.xs,
        },
        statEstate: { backgroundColor: c.successSurface },
        statDebts: { backgroundColor: c.errorSurface },
        // The debts amount keeps the error hue while the card holds the tint.
        debtAmount: { color: c.error },

        // Standalone deduction strip (e.g. a valid wasiya leaving the estate).
        deductionRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: radii.md,
          backgroundColor: c.surfaceVariant,
        },
        deductionLabel: { ...typography.label, color: c.textMuted },
        deductionValue: { ...typography.body, color: c.text },
        deductionNote: { ...typography.caption, color: c.warning },

        // Prominent net-for-distribution bar.
        netBar: {
          backgroundColor: c.primary,
          borderRadius: radii.lg,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        },
        netLabel: { ...typography.label, color: c.onPrimary },
        netValue: { ...typography.title, color: c.onPrimary },
        netNote: { ...typography.caption, color: c.textMuted },

        // One row per heir relation: info on the start side, count badge
        // on the end side, separated by a hairline divider.
        heirRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
          paddingVertical: spacing.sm,
          borderTopWidth: 1,
          borderTopColor: c.divider,
        },
        heirRowFirst: { borderTopWidth: 0 },
        heirInfo: { flex: 1, gap: spacing.xs },
        badge: {
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: radii.pill,
          backgroundColor: c.secondaryMuted,
          minWidth: spacing.xxl,
          alignItems: 'center',
        },
        badgeLabel: { ...typography.label, color: c.onSecondary },
        empty: { ...typography.body, color: c.textMuted },
      }),
    }),
    [c],
  );
}

export type WidgetStyles = ReturnType<typeof useWidgetStyles>;
