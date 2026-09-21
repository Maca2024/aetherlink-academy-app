import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {I18nProvider} from './i18n.tsx';
import {AppRoutes} from './routes.tsx';
import './style.css';

const root = document.getElementById('root');
if (!root) throw new Error('missing #root');

createRoot(root).render(
  <StrictMode>
    <I18nProvider>
      <AppRoutes />
    </I18nProvider>
  </StrictMode>,
);
