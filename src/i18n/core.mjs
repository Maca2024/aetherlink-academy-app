export const LOCALES = ['en', 'nl'];
export const DEFAULT_LOCALE = 'en';
export const STORAGE_KEY = 'academy-locale';

export function normalizeLocale(value) {
  if (value === 'en' || value === 'nl') return value;
  return DEFAULT_LOCALE;
}

/** Never uses browser locale — cleared storage / unknown → English. */
export function readStoredLocale(storage = globalThis.localStorage) {
  try {
    return normalizeLocale(storage?.getItem?.(STORAGE_KEY));
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function writeStoredLocale(locale, storage = globalThis.localStorage) {
  const next = normalizeLocale(locale);
  try {
    storage?.setItem?.(STORAGE_KEY, next);
  } catch {
    /* ignore quota / private mode */
  }
  return next;
}

export function createTranslate(catalogs) {
  return function translate(locale, key, vars) {
    const dict = catalogs[normalizeLocale(locale)] || catalogs.en;
    let text = dict?.[key];
    if (text == null || text === '') text = catalogs.en?.[key];
    if (text == null || text === '') text = key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = String(text).replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };
}

export function applyDocumentLang(locale) {
  const lang = normalizeLocale(locale);
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
  return lang;
}
