export const languages = {
  en: 'English',
  de: 'Deutsch',
};

export const defaultLang = 'en';

const basic = {
  en: {
    'nav.home': 'Home',
    'nav.planet': 'Planet',
    'one': 'one'
  },
  de: {
    'nav.home': 'Übersicht'
  },
} as const;

type BasicIndex = (typeof basic)[typeof defaultLang];
type BasicEntry = keyof BasicIndex;
export type SlottedTranslate = (index: BasicIndex, ...args: BasicEntry[]) => string;

const composite = {
  // requires the BasicIndex to be fully translated to compose!
  en: {
    'amount': (t: BasicIndex, fallback: BasicEntry = 'one', amount = 0) =>
      amount === 1
        ? t[fallback]
        : `${amount}`,
    'basic': (t: BasicIndex, b: BasicEntry = 'nav.home') => `B ${t[b]}`
  },
  de: {},
} as const;

type EntriesSlotsIndex = (typeof composite)[typeof defaultLang];
type EntryWithSlots = keyof EntriesSlotsIndex;

export const index = {
  en: {
    ...basic.en,
    ...composite.en,
  },
  de: {
    ...basic.de,
    ...composite.de,
  },
} as const;

export type TranslationIndex = (typeof index)[typeof defaultLang];
export type Entry = keyof TranslationIndex;
export type Language = keyof typeof languages;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in basic) return lang as Language;
  return defaultLang;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;

export type I18n = <Key extends Entry>(
  key: Key,
  ...slots: Key extends EntryWithSlots ? Tail<Parameters<EntriesSlotsIndex[Key]>> : []
) => string;

const FALLBACK_LANGUAGE: Language = defaultLang;

export function useTranslations(lang: Language = defaultLang): I18n {
  return function t(key, ...slots) {
    const translations = index[lang] as TranslationIndex;
    let f = translations[key];
    // eslint-disable-next-line  @typescript-eslint/no-unnecessary-condition
    if (FALLBACK_LANGUAGE && !f) {
      f = (index[FALLBACK_LANGUAGE] as TranslationIndex)[key];
    }
    if (typeof f === 'string') {
      return f;
    }
    // we only use types for autocompletion and compile time checking, there are no runtime checks if given slots actually match
    return (f as SlottedTranslate)(translations, ...(slots as Tail<Parameters<SlottedTranslate>>));
  };
}

// inspired by https://docs.astro.build/en/recipes/i18n/
