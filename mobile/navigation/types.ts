/**
 * Central type definition for the root navigation stack.
 *
 * Every screen registered in `RootStack` MUST appear here.
 * The value after the colon describes the route's expected params:
 *   - `undefined` → the screen takes no params
 *   - `{ ... }`   → an object describing required params
 *
 * Importing this type into components gives full autocomplete and
 * type-safety for `navigation.navigate(...)` and `route.params`.
 */
export type RootStackParamList = {
  Welcome: undefined;
  DeceasedInfo: undefined;
  FamilyDetails: undefined;
  Summary: undefined;
};
