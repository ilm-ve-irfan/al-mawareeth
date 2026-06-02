# Al Mawareeth — Color Palette

The mobile app's color system is derived from the "العلم والعرفان" logo: a
slate-gray mihrab arch with a gold accent and cream parchment background.
All UI colors should be referenced through this module so light/dark mode and
re-theming stay centralised.

## Brand colors

These are the raw values extracted from the logo. Use them only inside the
theme; screens should consume the `ColorScheme` tokens instead.

| Token         | Hex       | Source in logo                          |
| ------------- | --------- | --------------------------------------- |
| `slate`       | `#475569` | Mihrab arch outline (primary mass)      |
| `slateDeep`   | `#1F2937` | Arabic calligraphy text                 |
| `gold`        | `#B8924B` | Gold accent on the arch + filigree      |
| `goldSoft`    | `#D4AF7A` | Lifted gold for dark backgrounds        |
| `cream`       | `#F5F1E8` | Warm parchment behind the logo          |
| `parchment`   | `#FAFAF7` | Off-white app canvas                    |

## Semantic tokens

Screens import `useColors()` and read tokens by role — never by brand name —
so the same component renders correctly in both schemes.

### Light mode

| Token             | Hex       | Use it for                                              |
| ----------------- | --------- | ------------------------------------------------------- |
| `primary`         | `#475569` | Headers, primary buttons, active tabs, app bar          |
| `primaryMuted`    | `#94A3B8` | Disabled primary, secondary icons                       |
| `onPrimary`       | `#FFFFFF` | Text/icons placed on a `primary` background            |
| `secondary`       | `#B8924B` | Accents, links, focused state, key call-outs           |
| `secondaryMuted`  | `#E8D9B5` | Selected backgrounds, gold badge fills                  |
| `onSecondary`     | `#1F2937` | Text/icons placed on a `secondary` background          |
| `background`      | `#FAFAF7` | Root screen background                                  |
| `surface`         | `#FFFFFF` | Cards, sheets, modals, list rows                        |
| `surfaceVariant`  | `#F5F1E8` | Subtle grouped sections, input backgrounds              |
| `text`            | `#1F2937` | Default body text and headings                          |
| `textMuted`       | `#4B5563` | Captions, helper text, secondary labels                 |
| `textInverse`     | `#FFFFFF` | Text on dark/primary surfaces                           |
| `border`          | `#E5E7EB` | Card/input borders, separators on `surface`             |
| `divider`         | `#EDE7D7` | Soft dividers between grouped content                   |
| `success`         | `#16A34A` | Confirmation, valid input                               |
| `warning`         | `#D97706` | Caution, pending state                                  |
| `error`           | `#DC2626` | Destructive actions, validation errors                  |
| `info`            | `#2563EB` | Informational banners, neutral highlights               |
| `successSurface`  | `#E3EFE6` | Subtle success tint behind recap cards (estate total)   |
| `errorSurface`    | `#FBE6E6` | Subtle error tint behind recap cards (debts)            |

### Dark mode

| Token             | Hex       | Notes                                                   |
| ----------------- | --------- | ------------------------------------------------------- |
| `primary`         | `#94A3B8` | Lifted slate keeps headers readable on dark             |
| `primaryMuted`    | `#475569` | Disabled / pressed primary                              |
| `onPrimary`       | `#1F2937` | Dark text reads cleanly on the lighter slate            |
| `secondary`       | `#D4AF7A` | Softer gold preserves contrast without glare            |
| `secondaryMuted`  | `#5C4A28` | Filled gold badges on dark surfaces                     |
| `onSecondary`     | `#1F2937` | Keep onSecondary dark; gold stays light                 |
| `background`      | `#0F172A` | Deep slate canvas                                        |
| `surface`         | `#1E293B` | Cards, sheets                                            |
| `surfaceVariant`  | `#334155` | Grouped sections / input fills                          |
| `text`            | `#F8FAFC` | Default text                                             |
| `textMuted`       | `#CBD5E1` | Captions, helper text                                    |
| `textInverse`     | `#1F2937` | Text on light/primary surfaces                          |
| `border`          | `#334155` | Borders and separators                                   |
| `divider`         | `#1F2A3A` | Soft section dividers                                    |
| `success`         | `#4ADE80` | Lifted for legibility on dark                            |
| `warning`         | `#FBBF24` | Lifted amber                                             |
| `error`           | `#F87171` | Lifted red                                               |
| `info`            | `#60A5FA` | Lifted blue                                              |
| `successSurface`  | `#1C3328` | Success-tinted recap card surface                       |
| `errorSurface`    | `#3A2122` | Error-tinted recap card surface                         |

## Usage

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from './theme';

export function Header() {
  const c = useColors();
  return (
    <View style={[styles.bar, { backgroundColor: c.primary }]}>
      <Text style={{ color: c.onPrimary }}>المواريث</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { padding: 16 },
});
```

`useColors()` reads the device color scheme via React Native's
`useColorScheme()` and returns the matching `ColorScheme` object. Components
do not need to know which scheme is active.

## Rules of thumb

- Reach for `primary` for structural chrome (app bar, primary CTAs) and for
  `secondary` to draw attention (links, highlights, focused state).
- Keep gold (`secondary`) for emphasis only — large gold fills wash out the
  brand.
- Body content sits on `background`; raised elements use `surface`; grouped
  or inset content uses `surfaceVariant`.
- Status surfaces (`successSurface`, `errorSurface`) are for subtle filled
  tints behind at-a-glance recap cards; keep the matching `success` / `error`
  hue for the text or icon on top.
- Always pair a background token with its matching `on*` token for text and
  icons so contrast survives both schemes.
- Never inline hex codes in screens — add a new semantic token here instead.
