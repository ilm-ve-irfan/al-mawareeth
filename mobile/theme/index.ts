import { useColorScheme } from 'react-native';

import { ColorScheme, brand, darkColors, lightColors } from './colors';

export { brand, darkColors, lightColors };
export type { ColorScheme };

export {
  radii,
  spacing,
  typography,
  type RadiusKey,
  type SpacingKey,
  type TypographyVariant,
} from './tokens';

export function useColors(): ColorScheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}
