import React, { useMemo, Suspense } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { createSeaApi } from '@/infra/sea';
import { Home, getHomeInitialProps } from '../pages/Home';
import { CacheProvider } from '@/dataSource';
import { useCacheSet } from '@/dataSource/_cache';
import { AppStateProvider, useAppState, AppState } from '@/appState';
import { AppRoutes, createAction, useRouter, RouterProvider } from '@/router';
import { createBrowserHistory } from 'history';
import { getSettingsInitialProps, Settings } from '../pages/Settings';
import { DefaultLayout } from '../pages/_layout/DefaultLayout';
import { LoginedHeader, HeaderLayout } from '../Header/Header';
import { memoize } from '@/utils/memoize';

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

const getInitialAccount = memoize(({ seaDataSource }: AppState) => seaDataSource.getMe());
const AppRouter: React.FC = () => {
  const appState = useAppState();
  const history = useMemo(() => createBrowserHistory(), []);
  const account = useMemo(() => getInitialAccount(appState), [appState]);
  const { providerProps, renderPage } = useRouter({
    context: appState,
    routes,
    history,
    timeoutConfig: { timeoutMs: 3000 },
  });
  return (
    <RouterProvider value={providerProps}>
      <DefaultLayout
        headerContent={
          <Suspense fallback={<HeaderLayout />}>
            <LoginedHeader accountLoadable={account} />
          </Suspense>
        }
      >
        <Suspense fallback={null}>{renderPage()}</Suspense>
      </DefaultLayout>
    </RouterProvider>
  );
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
