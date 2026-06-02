import 'i18next';
import common from './locales/en/common.json';
import settings from './locales/en/settings.json';
import theme from './locales/en/theme.json';
import form from './locales/en/form.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      settings: typeof settings;
      theme: typeof theme;
      form: typeof form;
    };
  }
}
