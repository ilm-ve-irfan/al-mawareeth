// Design tokens for layout and typography.
// Colors live in ./colors.ts; everything else lives here so widget
// styles can compose tokens + colors without hard-coded numbers.

import type { TextStyle } from 'react-native';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingKey = keyof typeof spacing;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

export type RadiusKey = keyof typeof radii;

export type TypographyVariant =
  | 'display'
  | 'title'
  | 'body'
  | 'caption'
  | 'label';

export const typography: Record<TypographyVariant, TextStyle> = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '500' },
};
