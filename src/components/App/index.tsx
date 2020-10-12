import { Suspense, useState, useEffect, lazy } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { createRouter, useRouter, RouterProvider, Router, createRoutes } from '@/middlewares/router';
import { AppContext, createAppContext } from '@/app/context';
import { DefaultLayout } from '../pages/_layout/DefaultLayout';
import { HeaderPlaceholder } from '../Header/Placeholder';
import { SeaApiProvider } from '@/infra/sea';
import { Loadable } from '@/utils/Loadable';
import NavigationProgress from '@/components/NavigationProgress';
import { SeaPublicTimelineStreamProvider } from '@/features/SeaPosts';

const loadLoginedRoot = () => import(/* webpackChunkName: "logined", webpackPrefetch: true */ '../pages/LoginedRoot');
const loadHome = () => import(/* webpackChunkName: "home", webpackPrefetch: true */ '../pages/Home');
const loadSearch = () => import(/* webpackChunkName: "search", webpackPrefetch: true */ '../pages/Search');

const routes = createRoutes((builder) =>
  builder
    .addRoute('/login', {
      prepare: () => {},
      component: lazy(() => import(/* webpackChunkName: "login" */ '../pages/Login')),
    })
    .addRoute('/callback', {
      prepare: () => {},
      component: lazy(() => import(/* webpackChunkName: "auth_callback" */ '../pages/AuthCallback')),
    })
    .addRoute(
      '/',
      {
        prepare: (ctx) => Loadable.resolve(loadLoginedRoot().then((mod) => mod.getLoginedRootInitialProps(ctx))),
        component: lazy(loadLoginedRoot),
      },
      (child) =>
        child
          .addRoute('/', {
            exact: true,
            prepare: (ctx) => Loadable.resolve(loadHome().then((mod) => mod.getInitialProps(ctx))),
            component: lazy(loadHome),
          })
          .addRoute('/search', {
            exact: true,
            prepare: (ctx) => Loadable.resolve(loadSearch().then((mod) => mod.getInitialProps(ctx))),
            component: lazy(loadSearch),
          })
          .addRoute('/settings', {
            exact: true,
            prepare: () => {},
            component: lazy(() => import(/* webpackChunkName: "settings", webpackPrefetch: true*/ '../pages/Settings')),
          }),
    ),
);

const NAVIGATION_SUSPENSE_CONFIG: React.TimeoutConfig = { timeoutMs: 3000 };

const AppContent: React.FC = () => {
  const { node, isPending } = useRouter(NAVIGATION_SUSPENSE_CONFIG);
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress isPending={isPending} timeoutMs={NAVIGATION_SUSPENSE_CONFIG.timeoutMs} />
      </Suspense>
      <Suspense fallback={<DefaultLayout headerContent={<HeaderPlaceholder />} />}>{node}</Suspense>
    </>
  );
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
      <SeaPublicTimelineStreamProvider>
        <RouterProvider value={router}>
          <ColorTheme mode="auto" />
          <GlobalStyles />
          {content}
        </RouterProvider>
      </SeaPublicTimelineStreamProvider>
    </SeaApiProvider>
  );
};
