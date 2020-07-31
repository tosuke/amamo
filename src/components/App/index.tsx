import React, { useMemo, Suspense } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { Home, getHomeInitialProps } from '../pages/Home';
import { AppRoutes, createAction, useRouter, RouterProvider } from '@/router';
import { createBrowserHistory } from 'history';
import { getSettingsInitialProps, Settings } from '../pages/Settings';
import { DefaultLayout } from '../pages/_layout/DefaultLayout';
import { LoginedHeader, HeaderLayout, getLoginedHeaderInitialProps } from '../Header/Header';
import { memoize } from '@/utils/memoize';
import { createAppContext } from '@/app/context';
import { CacheProvider } from '@/cache';

const appContext = createAppContext();

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

const getInitialAccount = memoize(() => getLoginedHeaderInitialProps(appContext).accountRef);
const AppRouter: React.FC = () => {
  const history = useMemo(() => createBrowserHistory(), []);
  const account = useMemo(() => getInitialAccount(), []);
  const { providerProps, renderPage } = useRouter({
    context: appContext,
    routes,
    history,
    timeoutConfig: { timeoutMs: 3000 },
  });
  return (
    <CacheProvider value={appContext.cache}>
      <RouterProvider value={providerProps}>
        <DefaultLayout
          headerContent={
            <Suspense fallback={<HeaderLayout />}>
              <LoginedHeader accountRef={account} />
            </Suspense>
          }
        >
          <Suspense fallback={null}>{renderPage()}</Suspense>
        </DefaultLayout>
      </RouterProvider>
    </CacheProvider>
  );
};

export const App = () => {
  return (
    <>
      <ColorTheme mode="auto" />
      <GlobalStyles />
      <AppRouter />
    </>
  );
};
