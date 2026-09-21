import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {
  applyDocumentLang,
  normalizeLocale,
  readStoredLocale,
  translate,
  writeStoredLocale,
  type Locale,
  type StorageLike,
  type Vars,
} from '@academy/i18n';

export interface I18nValue {
  readonly locale: Locale;
  readonly setLocale: (next: unknown) => void;
  readonly t: (key: string, vars?: Vars) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export interface I18nProviderProps {
  readonly children: ReactNode;
  readonly storage?: StorageLike | undefined;
  readonly initialLocale?: Locale | undefined;
}

export function I18nProvider({children, storage, initialLocale}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale ?? readStoredLocale(storage));

  useEffect(() => {
    applyDocumentLang(locale);
    writeStoredLocale(locale, storage);
  }, [locale, storage]);

  const setLocale = useCallback((next: unknown) => setLocaleState(normalizeLocale(next)), []);
  const t = useCallback((key: string, vars?: Vars) => translate(locale, key, vars), [locale]);
  const value = useMemo<I18nValue>(() => ({locale, setLocale, t}), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n requires I18nProvider');
  return ctx;
}

export function LanguageToggle({className = ''}: {readonly className?: string}) {
  const {locale, setLocale, t} = useI18n();
  return (
    <div className={`language-toggle ${className}`.trim()} role="group" aria-label={t('locale.label')}>
      <button type="button" className={locale === 'en' ? 'selected' : ''} aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>
        {t('locale.en')}
      </button>
      <span aria-hidden="true">|</span>
      <button type="button" className={locale === 'nl' ? 'selected' : ''} aria-pressed={locale === 'nl'} onClick={() => setLocale('nl')}>
        {t('locale.nl')}
      </button>
    </div>
  );
}
