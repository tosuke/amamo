import UniversalRouterSync, { Routes, Route, RouteParams } from 'universal-router/sync';
import { History, Location } from 'history';
import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useContext,
  createContext,
  MutableSource,
  createMutableSource,
  useMutableSource,
  MutableSourceGetSnapshotFn,
  MutableSourceSubscribeFn,
  TransitionStartFunction,
  TimeoutConfig,
  unstable_useTransition as useTransition,
  Suspense,
  useRef,
} from 'react';
import { memoize } from '@/utils/memoize';
import { AppContext } from '@/app/context';

// Hackey type
type PageProps = {
  __pageProps: never;
};
type Page = Readonly<{
  props: PageProps;
  Component: React.ComponentType<PageProps>;
}>;

export type AppRouterContext = AppContext;
export type AppRoutes = Routes<Page, AppRouterContext>;

export const createAction = <P extends any>(
  getInitialProps: (context: AppRouterContext, params: RouteParams) => P,
  Component: React.ComponentType<P>
): NonNullable<Route<Page, AppRouterContext>['action']> => (context, params) => {
  const props = getInitialProps(context as any, params);
  return ({
    props,
    Component,
  } as unknown) as Page;
};

/// Router
type RouterContextType = {
  readonly historySource: MutableSource<History>;
  readonly isPending: boolean;
  readonly push: (href: string, startTransition?: TransitionStartFunction) => void;
};
const RouterContext = createContext<RouterContextType | undefined>(undefined);
if (process.env.NODE_ENV !== 'production') {
  RouterContext.displayName = 'RouterContext';
}

export const RouterProvider = RouterContext.Provider;

export type useRouterProps = {
  readonly context: AppRouterContext;
  readonly history: History;
  readonly routes: AppRoutes;
  readonly timeoutConfig?: TimeoutConfig;
  readonly fallback?: React.ReactNode;
};

type PageWithKey = Page;

const notFoundPage = {
  props: {} as PageProps,
  Component: (_props: PageProps) => null,
};

const getPage = (
  context: AppRouterContext,
  history: History,
  router: UniversalRouterSync<Page, AppRouterContext>
): PageWithKey => {
  const location = history.location;
  try {
    const result = router.resolve({ pathname: location.pathname, ...context });
    // FIXME: notFoundPageが密結合
    return result != null ? result : notFoundPage;
  } catch (e) {
    // FIXME: ちゃんとやる
    return notFoundPage;
  }
};

const getInitialPage = memoize(getPage);
const getRouter = memoize((routes: AppRoutes) => new UniversalRouterSync(routes));
export const useRouter = ({ context, history, routes, timeoutConfig, fallback = null }: useRouterProps) => {
  const historySource = useMemo(() => createMutableSource(history, () => history.location), [history]);
  const router = useMemo(() => getRouter(routes), [routes]);

  const [startTransition, isPending] = useTransition(timeoutConfig);

  const processKeyRef = useRef('');
  const [page, setPage] = useState(() => getInitialPage(context, history, router));

  const updatePage = useCallback(
    (startTransitionFn: TransitionStartFunction = startTransition) => {
      const newKey = history.location.pathname;
      if (processKeyRef.current === newKey) return;
      processKeyRef.current = newKey;
      const newPage = getPage(context, history, router);
      startTransitionFn(() => {
        setPage(newPage);
      });
    },
    [startTransition, page, context, history, router]
  );

  useEffect(
    () =>
      history.listen(({ location }) => {
        updatePage();
      }),
    [history, updatePage]
  );

  const push = useCallback(
    (href: string, startTransitionFn?: TransitionStartFunction) => {
      updatePage(startTransitionFn);
      history.push(href, {});
    },
    [history, updatePage]
  );

  const providerProps: RouterContextType = {
    historySource,
    isPending,
    push,
  };

  const renderPage = () => React.createElement(page.Component, page.props);

  return {
    providerProps,
    renderPage,
  } as const;
};

const useRouterContext = () => {
  const router = useContext(RouterContext);
  if (router == null) {
    throw new Error('cannot use Router without <Router/>');
  }
  return router;
};

const getSnapshot: MutableSourceGetSnapshotFn<History, Location> = (history) => history.location;
const subscribe: MutableSourceSubscribeFn<History> = (history, callback) => history.listen(callback);
export const useLocation = () => {
  const { historySource } = useRouterContext();
  return useMutableSource(historySource, getSnapshot, subscribe);
};

export const useNavigation = () => {
  const { historySource: _h, ...rest } = useRouterContext();
  return rest;
};

export const Link: React.FC<JSX.IntrinsicElements['a']> = (props) => {
  const { href } = props;
  const { push } = useRouterContext();
  const handleClick = useCallback<NonNullable<typeof props.onClick>>(
    (ev) => {
      if (href != null) {
        ev.preventDefault();
        push(href);
      }
    },
    [href, push]
  );
  return <a onClick={handleClick} {...props} />;
};
