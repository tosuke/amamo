import React, { Suspense, useState, useEffect } from 'react';
import { colors, ColorTheme, GlobalStyles } from '@/theme';
import { createRouter, useRouter, RouterProvider, Router, createRoutes } from '@/middlewares/router';
import { AppContext, createAppContext } from '@/app/context';
import { getHomeInitialProps } from '../pages/Home/getInitialProps';
import { getLoginedRootInitialProps, LoginedRoot } from '../pages/LoginedRoot';
import { DefaultLayout } from '../pages/_layout/DefaultLayout';
import { HeaderPlaceholder } from '../Header';
import { SeaApiProvider } from '@/infra/sea';
import { getSearchInitialProps } from '../pages/Search/getInitialProps';
import css from 'styled-jsx/css';
import { Line } from 'rc-progress';

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
        .addRoute('/search', {
          exact: true,
          prepare: getSearchInitialProps,
          component: React.lazy(() =>
            import(/* webpackChunkName: "search", webpackPrefetch: true */ '../pages/Search')
          ),
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

const NAVIGATION_SUSPENSE_CONFIG: React.TimeoutConfig = { timeoutMs: 3000 };

const navigationProgressStyles = css`
  .navigation-progress {
    line-height: 0;
    height: 0;
  }
`;
const NavigationProgress: React.FC<{ isPending: boolean }> = ({ isPending: navigationPending }) => {
  const [isPending, setIsPending] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!navigationPending) {
      setIsPending(false);
      setPercent(0);
      return;
    }
    const startMs = performance.now();
    let frameRequestHandle: number | undefined;
    const onFrame: FrameRequestCallback = (time) => {
      setPercent(((time - startMs) / NAVIGATION_SUSPENSE_CONFIG.timeoutMs) * 100);
      frameRequestHandle = requestAnimationFrame(onFrame);
    };
    const timerHandle = window.setTimeout(() => {
      setIsPending(true);
      frameRequestHandle = requestAnimationFrame(onFrame);
    }, 500);
    return () => {
      window.clearTimeout(timerHandle);
      if (frameRequestHandle != null) cancelAnimationFrame(frameRequestHandle);
    };
  }, [navigationPending]);

  return (
    <div className="navigation-progress" hidden={!isPending}>
      <style jsx>{navigationProgressStyles}</style>
      <Line
        strokeLinecap="square"
        strokeWidth={0.3}
        strokeColor={colors.accent}
        trailColor="transparent"
        percent={percent}
      />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { node, isPending } = useRouter(NAVIGATION_SUSPENSE_CONFIG);
  return (
    <>
      <NavigationProgress isPending={isPending} />
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
      <RouterProvider value={router}>
        <ColorTheme mode="auto" />
        <GlobalStyles />
        {content}
      </RouterProvider>
    </SeaApiProvider>
  );
};
