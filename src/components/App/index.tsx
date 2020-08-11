import React, { Suspense, useState, useEffect } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { createRouter, useRouter, RouterProvider, Router, createRoutes } from '@/middlewares/router';
import { AppContext, createAppContext } from '@/app/context';
import { getHomeInitialProps } from '../pages/Home/getInitialProps';
import { getLoginedRootInitialProps, LoginedRoot } from '../pages/LoginedRoot';
import { DefaultLayout } from '../pages/_layout/DefaultLayout';
import { HeaderPlaceholder } from '../Header';
import { SeaApiProvider } from '@/infra/sea';

const routes = createRoutes((builder) =>
  builder
    .addRoute('/login', {
      prepare: () => {},
      component: React.lazy(() => import(/* webpackChunkName: "login" */ '../pages/Login')),
    })
    .addRoute('/callback', {
      prepare: () => {},
      component: React.lazy(() => import(/* webpackChunkName: "auth_callback" */ '../pages/AuthCallback')),
    })
    .addRoute('/', { prepare: getLoginedRootInitialProps, component: LoginedRoot }, (child) =>
      child
        .addRoute('/', {
          exact: true,
          prepare: getHomeInitialProps,
          component: React.lazy(() => import(/* webpackChunkName: "home", webpackPrefetch: true */ '../pages/Home')),
        })
        .addRoute('/settings', {
          exact: true,
          prepare: () => {},
          component: React.lazy(() =>
            import(/* webpackChunkName: "settings", webpackPrefetch: true*/ '../pages/Settings')
          ),
        })
    )
);

const AppContent: React.FC = () => {
  const { node } = useRouter();
  return <Suspense fallback={<DefaultLayout headerContent={<HeaderPlaceholder />} />}>{node}</Suspense>;
};

export const App = () => {
  const [appContext, setAppContext] = useState<AppContext>();
  const [router, setRouter] = useState<Router>();
  useEffect(() => {
    const appContext = createAppContext();
    setAppContext(appContext);
    setRouter(createRouter(appContext, routes, appContext.history));
  }, []);

  const content = appContext != null && router != null ? <AppContent /> : null;

  return (
    <SeaApiProvider value={appContext?.api}>
      <RouterProvider value={router}>
        <ColorTheme mode="auto" />
        <GlobalStyles />
        {content}
      </RouterProvider>
    </SeaApiProvider>
  );
};
