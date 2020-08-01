import React, { Suspense, useState, useEffect } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { Home, getHomeInitialProps } from '../pages/Home';
import { createRouter, useRouter, RouterProvider, Router, createRoutes } from '@/middlewares/router';
import { createBrowserHistory } from 'history';
import { Settings } from '../pages/Settings';
import { AppContext, createAppContext } from '@/app/context';
import { CacheProvider } from '@/middlewares/cache';
import { getLoginedRootInitialProps, LoginedRoot } from '../pages/LoginedRoot';

const routes = createRoutes((builder) =>
  builder.addRoute('/', { prepare: getLoginedRootInitialProps, component: LoginedRoot }, (child) =>
    child
      .addRoute('/', { exact: true, prepare: getHomeInitialProps, component: Home })
      .addRoute('/settings', { exact: true, prepare: () => {}, component: Settings })
  )
);

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
