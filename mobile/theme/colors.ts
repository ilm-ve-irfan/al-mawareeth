// Color tokens for the Al Mawareeth mobile app.
// Palette derived from the "العلم والعرفان" logo:
//   - slate mihrab arch  -> primary
//   - gold accent/pattern -> secondary
//   - cream parchment     -> light surfaces
//
// See ./README.md for the full usage guide.

export const brand = {
  slate: '#475569',
  slateDeep: '#1F2937',
  gold: '#B8924B',
  goldSoft: '#D4AF7A',
  cream: '#F5F1E8',
  parchment: '#FAFAF7',
} as const;

export type ColorScheme = {
  primary: string;
  primaryMuted: string;
  onPrimary: string;

  secondary: string;
  secondaryMuted: string;
  onSecondary: string;

  background: string;
  surface: string;
  surfaceVariant: string;

  text: string;
  textMuted: string;
  textInverse: string;

  border: string;
  divider: string;

  success: string;
  warning: string;
  error: string;
  info: string;

  // Subtle status-tinted card surfaces. Used for at-a-glance recap cards
  // (e.g. the estate / debts pair on the summary screen) where a filled
  // tint communicates polarity without shouting like the full status hue.
  successSurface: string;
  errorSurface: string;
};

export const lightColors: ColorScheme = {
  primary: brand.slate,
  primaryMuted: '#94A3B8',
  onPrimary: '#FFFFFF',

  secondary: brand.gold,
  secondaryMuted: '#E8D9B5',
  onSecondary: '#1F2937',

  background: brand.parchment,
  surface: '#FFFFFF',
  surfaceVariant: brand.cream,

  text: brand.slateDeep,
  textMuted: '#4B5563',
  textInverse: '#FFFFFF',

  border: '#E5E7EB',
  divider: '#EDE7D7',

  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',

  successSurface: '#E3EFE6',
  errorSurface: '#FBE6E6',
};

export const darkColors: ColorScheme = {
  primary: '#94A3B8',
  primaryMuted: '#475569',
  onPrimary: brand.slateDeep,

  secondary: brand.goldSoft,
  secondaryMuted: '#5C4A28',
  onSecondary: brand.slateDeep,

  background: '#0F172A',
  surface: '#1E293B',
  surfaceVariant: '#334155',

  text: '#F8FAFC',
  textMuted: '#CBD5E1',
  textInverse: brand.slateDeep,

  border: '#334155',
  divider: '#1F2A3A',

  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  successSurface: '#1C3328',
  errorSurface: '#3A2122',
};
