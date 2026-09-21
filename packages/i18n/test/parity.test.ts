import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {describe, expect, test} from 'vitest';
import {
  DEFAULT_LOCALE,
  STORAGE_KEY,
  applyDocumentLang,
  catalogs,
  createTranslate,
  normalizeLocale,
  readStoredLocale,
  translate,
  writeStoredLocale,
} from '../src/index.ts';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..', '..');

describe('dictionary parity with the verified legacy catalogs', () => {
  for (const locale of ['en', 'nl'] as const) {
    test(`${locale}.json is a byte copy of src/i18n/${locale}.json`, () => {
      const legacy = readFileSync(join(repoRoot, 'src', 'i18n', `${locale}.json`));
      const copy = readFileSync(join(here, '..', 'src', `${locale}.json`));
      expect(copy.equals(legacy)).toBe(true);
    });
  }

  test('every NL key exists in EN', () => {
    const missing = Object.keys(catalogs.nl).filter((key) => !(key in catalogs.en));
    expect(missing).toEqual([]);
  });
});

describe('translate core', () => {
  test('defaults to English and never sniffs the browser locale', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(normalizeLocale(undefined)).toBe('en');
    expect(normalizeLocale('fr')).toBe('en');
    expect(normalizeLocale('nl')).toBe('nl');
    expect(readStoredLocale({getItem: () => null})).toBe('en');
    expect(readStoredLocale({getItem: () => { throw new Error('blocked'); }})).toBe('en');
  });

  test('handles a localStorage getter that throws', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    try {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        get: () => { throw new Error('blocked'); },
      });
      expect(readStoredLocale()).toBe('en');
      expect(writeStoredLocale('nl')).toBe('nl');
    } finally {
      if (original) Object.defineProperty(globalThis, 'localStorage', original);
      else delete (globalThis as {localStorage?: unknown}).localStorage;
    }
  });

  test('persists under the legacy storage key', () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    expect(writeStoredLocale('nl', storage)).toBe('nl');
    expect(store.get(STORAGE_KEY)).toBe('nl');
    expect(readStoredLocale(storage)).toBe('nl');
  });

  test('NL falls back to EN and then to the key, with variable substitution', () => {
    expect(translate('en', 'nav.squad')).toBe('Squad room');
    expect(translate('nl', 'nav.squad')).toBe('Squad-room');
    expect(translate('nl', 'room.round', {round: 3})).toBe('Ronde 3');
    const partial = createTranslate({en: {'a.b': 'English only'}, nl: {'a.b': ''}});
    expect(partial('nl', 'a.b')).toBe('English only');
    expect(partial('nl', 'missing.key')).toBe('missing.key');
  });

  test('applyDocumentLang writes the html lang attribute', () => {
    const doc = {documentElement: {lang: ''}} as unknown as Document;
    expect(applyDocumentLang('nl', doc)).toBe('nl');
    expect(doc.documentElement.lang).toBe('nl');
    expect(applyDocumentLang('xx', doc)).toBe('en');
  });
});
