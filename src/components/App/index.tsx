import React, { useMemo } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { createSeaApi } from '@/infra/sea';
import { Home, getHomeInitialProps } from '../pages/Home';
import { CacheProvider } from '@/dataSource';
import { useCacheSet } from '@/dataSource/_cache';
import { AppStateProvider, useAppState } from '@/appState';
import { AppRoutes, createAction, Router } from '@/router';
import { createBrowserHistory } from 'history';
import { getSettingsInitialProps, Settings } from '../pages/Settings';
import { DefaultLayout } from '../pages/_layout/DefaultLayout';
import { HeaderPlaceholder } from '../Header/Header';

const AppContainer: React.FC = ({ children }) => {
  // TODO: Create API directly
  const api = createSeaApi(process.env.API_ROOT!, process.env.TOKEN!);
  const setCache = useCacheSet();

  return (
    <AppStateProvider api={api} setCache={setCache}>
      {children}
    </AppStateProvider>
  );
};

const routes: AppRoutes = [
  {
    path: '/settings',
    action: createAction(getSettingsInitialProps, Settings),
  },
  {
    path: '/',
    action: createAction(getHomeInitialProps, Home),
  },
];

const AppRouter: React.FC = () => {
  const appState = useAppState();
  const history = useMemo(() => createBrowserHistory(), []);
  return <Router context={appState} routes={routes} history={history} timeoutConfig={{ timeoutMs: 100000 }} />;
};

export const App = () => {
  return (
    <>
      <ColorTheme mode="auto" />
      <GlobalStyles />
      <CacheProvider>
        <AppContainer>
          <AppRouter />
        </AppContainer>
      </CacheProvider>
    </>
  );
};
