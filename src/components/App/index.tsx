import React, { Suspense, useState, useEffect } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { Home, getHomeInitialProps } from '../pages/Home';
import { AppRouteConfig, createRouter, useRouter, RouterProvider, Router } from '@/middlewares/router';
import { createBrowserHistory } from 'history';
import { getSettingsInitialProps, Settings } from '../pages/Settings';
import { DefaultLayout } from '../pages/_layout/DefaultLayout';
import { LoginedHeader, HeaderPlaceholder, getLoginedHeaderInitialProps } from '@/components/Header';
import { memoize } from '@/utils/memoize';
import { AppContext, createAppContext } from '@/app/context';
import { CacheProvider } from '@/middlewares/cache';
import { getLoginedRootInitialProps, LoginedRoot } from '../pages/LoginedRoot';

/*const routes: AppRoutes = [
  {
    path: '/settings',
    action: createAction(getSettingsInitialProps, Settings),
  },
  {
    path: '/',
    action: createAction(getHomeInitialProps, Home),
  },
];*/

const routes: AppRouteConfig[] = [
  {
    path: '/',
    prepare: getLoginedRootInitialProps,
    component: LoginedRoot as React.ComponentType,
    routes: [
      {
        path: '/',
        exact: true,
        prepare: getHomeInitialProps,
        // FIXME: 型を直す
        component: Home as React.ComponentType,
      },
      {
        path: '/settings',
        exact: true,
        component: Settings,
      },
    ],
  },
];

const AppContent: React.FC = () => {
  const { node } = useRouter();
  return <Suspense fallback={'loading...'}>{node}</Suspense>;
};

export const App = () => {
  const [appContext, setAppContext] = useState<AppContext>();
  const [router, setRouter] = useState<Router>();
  useEffect(() => {
    const appContext = createAppContext();
    const history = createBrowserHistory();
    setAppContext(appContext);
    setRouter(createRouter(appContext, routes, history));
  }, []);

  const content = appContext != null && router != null ? <AppContent /> : null;

  return (
    <CacheProvider value={appContext?.cache}>
      <RouterProvider value={router}>
        <ColorTheme mode="auto" />
        <GlobalStyles />
        {content}
      </RouterProvider>
    </CacheProvider>
  );
};
