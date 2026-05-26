# Mobile Multi-Language Support (react-i18next)

This app uses `react-i18next` with `i18next` to support English and Arabic. The setup auto-detects device language, persists user choice, and supports RTL switching.

## Where the setup lives

- App initialization happens in [mobile/index.ts](../../mobile/index.ts#L1).
- i18n configuration and namespaces are in [mobile/src/i18n/index.ts](../../mobile/src/i18n/index.ts#L1).
- Device language detection and storage are in [mobile/src/i18n/language-detector.ts](../../mobile/src/i18n/language-detector.ts#L1).
- Locale resources are wired in [mobile/src/i18n/locales/index.ts](../../mobile/src/i18n/locales/index.ts#L1).
- Translation JSON files are referenced from [mobile/src/i18n/locales/index.ts](../../mobile/src/i18n/locales/index.ts#L1).
- Language switching (including RTL reload) is in [mobile/src/utils/language.ts](../../mobile/src/utils/language.ts#L1).

## Use translations in a component

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation(['settings']);

return <Text>{t('switch_lang', { lang: t('languages.en') })}</Text>;
```

## Add a new translation key

1. Pick the namespace file (for example, `common` or `settings`).
2. Add the key to both languages:

- [mobile/src/i18n/locales/en/common.json](../../mobile/src/i18n/locales/en/common.json)
- [mobile/src/i18n/locales/ar/common.json](../../mobile/src/i18n/locales/ar/common.json)

Example:

```json
{
  "welcome": "Welcome to our application!"
}
```

## Add a new namespace

1. Create a JSON file per language for the new namespace (for example, a `profile` namespace).
2. Wire them in [mobile/src/i18n/locales/index.ts](../../mobile/src/i18n/locales/index.ts#L1):

```ts
import enProfile from './en/profile.json';
import arProfile from './ar/profile.json';

export const resources = {
  en: {
    common: enCommon,
    settings: enSettings,
    profile: enProfile,
  },
  ar: {
    common: arCommon,
    settings: arSettings,
    profile: arProfile,
  },
};
```

3. Add the namespace to [mobile/src/i18n/index.ts](../../mobile/src/i18n/index.ts#L1):

```ts
defaultNS: 'common',
ns: ['common', 'settings', 'profile'],
```

4. Add the namesapces in [mobile/src/i18n/i18next.d.ts](../../mobile/src/i18n/i18next.d.ts), to get typescript code suggestions

```ts
import profile from './locales/en/profile.json';

resources: {
  common: typeof common;
  settings: typeof settings;
  profile: typeof profile;
}
```

## Add a new language

1. Create a new folder under the locales directory (for example, `fr`).
2. Add JSON files for every namespace.
3. Update [mobile/src/i18n/locales/index.ts](../../mobile/src/i18n/locales/index.ts#L1) to include the new language.
4. Add the language code to `supportedLngs` in [mobile/src/i18n/index.ts](../../mobile/src/i18n/index.ts#L1).
5. Add the language label in each settings file so the switcher can display it:

- [mobile/src/i18n/locales/en/settings.json](../../mobile/src/i18n/locales/en/settings.json)
- [mobile/src/i18n/locales/ar/settings.json](../../mobile/src/i18n/locales/ar/settings.json)

## Language detection and switching

- Device language is detected in [mobile/src/i18n/language-detector.ts](../../mobile/src/i18n/language-detector.ts#L1) using `expo-localization`.
- User choice is stored in AsyncStorage under the key `settings.lang`.
- Switching language should use `changeLanguage` from [mobile/src/utils/language.ts](../../mobile/src/utils/language.ts#L1) to handle RTL reloads safely.
