import React, { useMemo, Suspense, useState, useEffect } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { Home, getHomeInitialProps } from '../pages/Home';
import { AppRoutes, createAction, useRouter, RouterProvider } from '@/middlewares/router_old';
import { createBrowserHistory } from 'history';
import { getSettingsInitialProps, Settings } from '../pages/Settings';
import { DefaultLayout } from '../pages/_layout/DefaultLayout';
import { LoginedHeader, HeaderPlaceholder, getLoginedHeaderInitialProps } from '@/components/Header';
import { memoize } from '@/utils/memoize';
import { AppContext, createAppContext } from '@/app/context';
import { CacheProvider } from '@/middlewares/cache';

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

const getInitialAccount = memoize((appContext: AppContext) => getLoginedHeaderInitialProps(appContext).accountRef);
const AppContent: React.FC<{ appContext: AppContext }> = ({ appContext }) => {
  const history = useMemo(() => createBrowserHistory(), []);
  const account = useMemo(() => getInitialAccount(appContext), [appContext]);
  const { providerProps, renderPage } = useRouter({
    context: appContext,
    routes,
    history,
    timeoutConfig: { timeoutMs: 2000 },
  });
  return (
    <RouterProvider value={providerProps}>
      <DefaultLayout
        headerContent={
          <Suspense fallback={<HeaderPlaceholder />}>
            <LoginedHeader accountRef={account} />
          </Suspense>
        }
      >
        <Suspense fallback={'loading...'}>{renderPage()}</Suspense>
      </DefaultLayout>
    </RouterProvider>
  );
};

export const App = () => {
  const [appContext, setAppContext] = useState<AppContext>();
  useEffect(() => {
    setAppContext(createAppContext());
  }, []);

  const content = appContext ? <AppContent appContext={appContext} /> : null;

  return (
    <CacheProvider value={appContext?.cache}>
      <ColorTheme mode="auto" />
      <GlobalStyles />
      {content}
    </CacheProvider>
  );
};
