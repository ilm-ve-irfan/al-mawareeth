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
        field: {
          ...typography.body,
          color: c.text,
          backgroundColor: c.surface,
          borderColor: c.border,
          borderWidth: 1,
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 44,
        },
        fieldError: { borderColor: c.error },
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
    }),
    [c],
  );
}

export type WidgetStyles = ReturnType<typeof useWidgetStyles>;
