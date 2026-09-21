import {useEffect, useState, type ReactNode} from 'react';
import {LanguageToggle, useI18n} from './i18n.tsx';

export type RouteId = 'squad' | 'route' | 'lesson' | 'solo' | 'coach' | 'review' | 'connection';

export interface RouteDef {
  readonly id: RouteId;
  readonly path: string;
  readonly labelKey: string;
}

export const ROUTES: ReadonlyArray<RouteDef> = [
  {id: 'squad', path: '/', labelKey: 'nav.squad'},
  {id: 'route', path: '/route', labelKey: 'nav.route'},
  {id: 'lesson', path: '/lesson', labelKey: 'nav.lesson'},
  {id: 'solo', path: '/solo', labelKey: 'nav.solo'},
  {id: 'coach', path: '/coach', labelKey: 'nav.coach'},
  {id: 'review', path: '/review', labelKey: 'nav.review'},
  {id: 'connection', path: '/connection-status', labelKey: 'connection.status'},
];

export function matchRoute(pathname: string): RouteDef {
  return ROUTES.find((route) => route.path === pathname) ?? ROUTES[0]!;
}

interface ProbeView {
  readonly reachable: boolean;
  readonly latencyMs: number;
  readonly error: string | null;
}

export interface ConnectionView {
  readonly postgres: ProbeView;
  readonly redis: ProbeView;
  readonly proof: ProbeView;
  readonly checkedAt: string;
}

export type ConnectionState =
  | {readonly kind: 'loading'}
  | {readonly kind: 'unreachable'; readonly error: string}
  | {readonly kind: 'ready'; readonly report: ConnectionView};

export type ConnectionFetcher = () => Promise<ConnectionState>;

export const fetchConnection: ConnectionFetcher = async () => {
  try {
    const response = await fetch('/connection', {signal: AbortSignal.timeout(5000)});
    if (!response.ok) return {kind: 'unreachable', error: `HTTP ${response.status}`};
    return {kind: 'ready', report: (await response.json()) as ConnectionView};
  } catch (error) {
    return {kind: 'unreachable', error: error instanceof Error ? error.message : String(error)};
  }
};

export interface ShellProps {
  readonly pathname: string;
  readonly navigate: (path: string) => void;
  readonly connection: ConnectionState;
}

export function Shell({pathname, navigate, connection}: ShellProps) {
  const {t, locale} = useI18n();
  const active = matchRoute(pathname);
  return (
    <div className="shell" data-locale={locale}>
      <aside className="sidebar">
        <div className="brand">{t('brand.academy')}</div>
        <p className="tagline">
          {t('nav.tagline1')} {t('nav.tagline2')} {t('nav.tagline3')}
        </p>
        <nav aria-label={t('nav.main')}>
          <ul>
            {ROUTES.map((route) => (
              <li key={route.id}>
                <a
                  href={route.path}
                  aria-current={route.id === active.id ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate(route.path);
                  }}
                >
                  {t(route.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="schedule">{t('nav.schedule')}</p>
      </aside>
      <main>
        <header className="topbar">
          <h1>{t(active.labelKey)}</h1>
          <LanguageToggle />
        </header>
        <section className="panel">
          {active.id === 'connection' ? <ConnectionPanel state={connection} /> : <Placeholder route={active} />}
        </section>
        <footer>{t('room.footer')}</footer>
      </main>
    </div>
  );
}

function Placeholder({route}: {readonly route: RouteDef}) {
  const {t} = useI18n();
  return (
    <div className="placeholder" data-route={route.id}>
      <p className="eyebrow">{t('route.eyebrow')}</p>
      <p>{t('route.lede')}</p>
    </div>
  );
}

export function ConnectionPanel({state}: {readonly state: ConnectionState}) {
  const {t} = useI18n();
  if (state.kind === 'loading') return <p className="status">{t('common.loading')}</p>;
  if (state.kind === 'unreachable') {
    return (
      <p className="status status-bad" role="status">
        {t('account.disconnected')} · {state.error}
      </p>
    );
  }
  const rows: ReadonlyArray<[string, ProbeView]> = [
    ['Postgres', state.report.postgres],
    ['Redis', state.report.redis],
    ['Proof', state.report.proof],
  ];
  return (
    <table className="connection">
      <tbody>
        {rows.map(([name, probe]) => (
          <tr key={name} data-reachable={probe.reachable}>
            <th scope="row">{name}</th>
            <td>{probe.reachable ? t('overview.online') : t('overview.offline')}</td>
            <td>{probe.latencyMs} ms</td>
            <td>{probe.error ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function useConnection(fetcher: ConnectionFetcher, intervalMs = 5000): ConnectionState {
  const [state, setState] = useState<ConnectionState>({kind: 'loading'});
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const next = await fetcher();
      if (!cancelled) setState(next);
    };
    void tick();
    const timer = setInterval(() => void tick(), intervalMs);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [fetcher, intervalMs]);
  return state;
}

export function usePathname(): [string, (path: string) => void] {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setPathname(path);
  };
  return [pathname, navigate];
}

export function AppRoutes({children}: {readonly children?: ReactNode}) {
  const [pathname, navigate] = usePathname();
  const connection = useConnection(fetchConnection);
  return (
    <>
      <Shell pathname={pathname} navigate={navigate} connection={connection} />
      {children}
    </>
  );
}
