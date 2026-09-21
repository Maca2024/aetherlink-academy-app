import {renderToString} from 'react-dom/server';
import {describe, expect, test} from 'vitest';
import en from '@academy/i18n/en.json' with {type: 'json'};
import nl from '@academy/i18n/nl.json' with {type: 'json'};
import {I18nProvider} from '../src/i18n.tsx';
import {ConnectionPanel, Shell, matchRoute, type ConnectionState} from '../src/routes.tsx';

const render = (locale: 'en' | 'nl', pathname = '/', connection: ConnectionState = {kind: 'loading'}) =>
  renderToString(
    <I18nProvider initialLocale={locale} storage={{getItem: () => null, setItem: () => {}}}>
      <Shell pathname={pathname} navigate={() => {}} connection={connection} />
    </I18nProvider>,
  );

describe('web shell in both locales', () => {
  test('English is the default and the navigation uses the copied EN catalog', () => {
    const html = render('en');
    expect(html).toContain(`data-locale="en"`);
    expect(html).toContain(en['nav.squad']);
    expect(html).toContain(en['nav.route']);
    expect(html).toContain(en['nav.coach']);
    expect(html).toContain(en['room.footer']);
    expect(html).not.toContain(nl['nav.coach']);
  });

  test('Dutch renders the copied NL catalog', () => {
    const html = render('nl');
    expect(html).toContain(`data-locale="nl"`);
    expect(html).toContain(nl['nav.squad']);
    expect(html).toContain(nl['nav.route']);
    expect(html).toContain(nl['nav.coach']);
    expect(html).toContain(nl['room.footer']);
    expect(html).not.toContain(en['nav.coach']);
  });

  test('the toggle marks the active locale', () => {
    expect(render('en')).toMatch(/aria-pressed="true"[^>]*>EN</);
    expect(render('nl')).toMatch(/aria-pressed="true"[^>]*>NL</);
  });

  test('unknown paths fall back to the squad room', () => {
    expect(matchRoute('/nope').id).toBe('squad');
    expect(matchRoute('/coach').id).toBe('coach');
  });

  test('connection route stays neutral while loading or offline', () => {
    const loading = render('en', '/connection-status', {kind: 'loading'});
    const offline = render('en', '/connection-status', {kind: 'unreachable', error: 'fetch failed'});
    expect(loading).toContain('Connection status');
    expect(offline).toContain('Connection status');
    expect(loading).not.toContain(en['account.connected']);
    expect(offline).not.toContain(en['account.connected']);
  });
});

describe('connection panel does not invent a status', () => {
  const panel = (state: ConnectionState) =>
    renderToString(
      <I18nProvider initialLocale="en" storage={{getItem: () => null, setItem: () => {}}}>
        <ConnectionPanel state={state} />
      </I18nProvider>,
    );

  test('server unreachable shows the disconnected message and the error', () => {
    const html = panel({kind: 'unreachable', error: 'fetch failed'});
    expect(html).toContain(en['account.disconnected']);
    expect(html).toContain('fetch failed');
  });

  test('a report renders each dependency with its own flag and error text', () => {
    const html = panel({
      kind: 'ready',
      report: {
        postgres: {reachable: false, latencyMs: 2003, error: 'timeout'},
        redis: {reachable: true, latencyMs: 2, error: null},
        proof: {reachable: true, latencyMs: 9, error: null},
        checkedAt: '2026-09-21T10:00:00.000Z',
      },
    });
    expect(html).toContain('data-reachable="false"');
    expect(html).toContain('timeout');
    expect(html.match(/data-reachable="true"/g)?.length).toBe(2);
  });
});
