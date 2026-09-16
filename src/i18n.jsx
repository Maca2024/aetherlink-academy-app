import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import en from './i18n/en.json';
import nl from './i18n/nl.json';
import {
  DEFAULT_LOCALE,
  STORAGE_KEY,
  LOCALES,
  normalizeLocale,
  readStoredLocale,
  writeStoredLocale,
  createTranslate,
  applyDocumentLang,
} from './i18n/core.mjs';

const catalogs = {en, nl};
const translate = createTranslate(catalogs);

export {DEFAULT_LOCALE, STORAGE_KEY, LOCALES, normalizeLocale, readStoredLocale, writeStoredLocale, applyDocumentLang};
export function translateLocale(locale, key, vars) {
  return translate(locale, key, vars);
}

const I18nContext = createContext(null);

export function I18nProvider({children, storage}) {
  const [locale, setLocaleState] = useState(() => readStoredLocale(storage));

  useEffect(() => {
    applyDocumentLang(locale);
    writeStoredLocale(locale, storage);
  }, [locale, storage]);

  const setLocale = useCallback((next) => {
    setLocaleState(normalizeLocale(next));
  }, []);

  const t = useCallback((key, vars) => translate(locale, key, vars), [locale]);

  const value = useMemo(() => ({locale, setLocale, t}), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n requires I18nProvider');
  return ctx;
}

export function useT() {
  return useI18n().t;
}

export function LanguageToggle({className = ''}) {
  const {locale, setLocale, t} = useI18n();
  return (
    <div className={`language-toggle ${className}`.trim()} role="group" aria-label={t('locale.label')}>
      <button
        type="button"
        className={locale === 'en' ? 'selected' : ''}
        aria-pressed={locale === 'en'}
        onClick={() => setLocale('en')}
      >
        {t('locale.en')}
      </button>
      <span aria-hidden="true">|</span>
      <button
        type="button"
        className={locale === 'nl' ? 'selected' : ''}
        aria-pressed={locale === 'nl'}
        onClick={() => setLocale('nl')}
      >
        {t('locale.nl')}
      </button>
    </div>
  );
}
