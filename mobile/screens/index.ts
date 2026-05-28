/**
 * Barrel file for all inheritance-flow screens.
 *
 * Lets consumers import every screen from a single path:
 *   import { WelcomeScreen, SummaryScreen } from '../screens';
 *
 * Each screen is a default export in its own folder, re-exported
 * here under a named export so the stack navigator can register
 * them without five separate import lines.
 */
export { default as WelcomeScreen } from './Welcome';
export { default as DeceasedInfoScreen } from './DeceasedInfo';
export { default as AssetsLiabilitiesScreen } from './AssetsLiabilities';
export { default as FamilyDetailsScreen } from './FamilyDetails';
export { default as SummaryScreen } from './Summary';
