# Al Mawareeth — Widget Styles

Central styling for reusable widgets. Components must consume styles
through `useWidgetStyles()` so that layout, radii, typography, and the
active color scheme stay in sync across the app.

## Layers

```
theme/colors.ts      → palette (light + dark)
theme/tokens.ts      → spacing, radii, typography variants
styles/widgets.ts    → useWidgetStyles() — StyleSheets per widget
components/*         → consumers; never re-style from raw tokens
```

Every consumer composes from `useWidgetStyles()`. The hook calls
`useColors()` internally, so light/dark switching is automatic.

## Tokens

### `spacing`

| Key     | px  | Use for                              |
| ------- | --- | ------------------------------------ |
| `xs`    | 4   | Tight inline gaps                    |
| `sm`    | 8   | Default gap between siblings         |
| `md`    | 12  | Inner widget padding                 |
| `lg`    | 16  | Card / screen padding                |
| `xl`    | 24  | Section separation                   |
| `xxl`   | 32  | Large section gaps                   |
| `xxxl`  | 48  | Hero / safe-area offsets             |

### `radii`

| Key    | px  | Use for                            |
| ------ | --- | ---------------------------------- |
| `sm`   | 4   | Inline chips, tags                 |
| `md`   | 8   | Buttons, inputs                    |
| `lg`   | 12  | Cards, sheets                      |
| `pill` | 999 | Pill-shaped buttons, avatars       |

### `typography`

| Variant   | size / line-height | weight | Use for                          |
| --------- | ------------------ | ------ | -------------------------------- |
| `display` | 32 / 40            | 700    | Hero titles, screen headers      |
| `title`   | 22 / 28            | 600    | Section titles, card headers     |
| `body`    | 16 / 22            | 400    | Default paragraph text           |
| `caption` | 13 / 18            | 400    | Secondary text, helper / hints   |
| `label`   | 14 / 18            | 500    | Form labels, button labels       |

## Widget styles

`useWidgetStyles()` returns a namespaced `StyleSheet` per widget:

| Namespace   | Keys                                                              |
| ----------- | ----------------------------------------------------------------- |
| `button`    | `base`, `primary`, `secondary`, `ghost`, `disabled`, `pressed`, `labelPrimary`, `labelSecondary`, `labelGhost` |
| `card`      | `base`                                                            |
| `input`     | `wrapper`, `label`, `box`, `boxError`, `control`, `adornment`, `adornmentOk`, `adornmentBad`, `error` |
| `text`      | `display`, `title`, `body`, `caption`, `label`                    |
| `progress`  | `container`, `track`, `segment`, `segmentDone`, `segmentCurrent`  |
| `segmented` | `container`, `option`, `optionActive`, `label`, `labelActive`     |
| `select`    | `trigger`, `triggerLabel`, `triggerDisabled`, `chevron`, `backdrop`, `menu`, `option`, `optionLabel`, `optionSelected` |
| `summary`   | `statsRow`, `statCard`, `statEstate`, `statDebts`, `debtAmount`, `deductionRow`, `deductionLabel`, `deductionValue`, `deductionNote`, `netBar`, `netLabel`, `netValue`, `netNote`, `heirRow`, `heirRowFirst`, `heirInfo`, `badge`, `badgeLabel`, `empty` |

> `Switch` has no namespace: it wraps React Native's native `Switch` and
> takes its on/off colors directly from `useColors()`.

## Usage

```tsx
import { Button, Card, Text, TextField } from './components';

function Example() {
  return (
    <Card>
      <Text variant="title">Heir</Text>
      <TextField label="Name" placeholder="…" />
      <Button label="Save" />
    </Card>
  );
}
```

For one-off layout, pull tokens directly from the theme:

```tsx
import { StyleSheet } from 'react-native';
import { spacing } from './theme';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
});
```

## Adding a new widget style

1. Add a new namespace to `useWidgetStyles()` in `styles/widgets.ts`,
   composing from `spacing`, `radii`, `typography`, and the active
   `ColorScheme`.
2. Document the namespace in the table above.
3. Build a component under `components/` that consumes it and re-export
   it from `components/index.ts`.
4. Never inline hex codes, font sizes, or magic numbers in the
   component — promote them to tokens or widget styles instead.
