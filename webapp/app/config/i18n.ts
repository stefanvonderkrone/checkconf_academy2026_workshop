// This is the list of languages your application supports, the last one is your
// fallback language
export const supportedLngs = ['de'];
// export const supportedLngs = ['de', 'en'];

// This is the language you want to use in case
// the user language is not in the supportedLngs
export const fallbackLng = 'de';

// The default namespace of i18next is "translation", but you can customize it
export const defaultNS = 'translation';

// Disable i18next HTML escaping globally — React already escapes via JSX,
// so double-escaping causes characters like "/" to render as "&#x2F;"
export const interpolation = { escapeValue: false } as const;

