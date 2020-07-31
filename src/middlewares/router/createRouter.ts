import { matchRoutes, RouteConfig } from 'react-router-config';
import { History, Location } from 'history';
import { Merge } from 'type-fest';
import { AppContext } from '@/app/context';
import { Router, RouterEntry } from './RouterContext';
import { createMutableSource } from 'react';
import { memoize } from '@/utils/memoize';

export type AppRouteConfig = RouteConfig & {
  prepare?: (appContext: AppContext) => Record<string, unknown>;
  routes?: AppRouteConfig[];
  component?: React.ComponentType;
};

export function createRouter(appContext: AppContext, routes: AppRouteConfig[], history: History): Router {
  const historySource = createMutableSource(history, () => history.location);

  const getEntries = memoize((location: Location) => {
    const matches = matchRoutes(routes, location.pathname);
    const entries: RouterEntry[] = matches.map((match) => {
      const route = match.route as AppRouteConfig;
      const component = (route?.component ??
        ((props: React.PropsWithChildren<{}>) => props.children)) as React.ComponentType;
      const prepared = route?.prepare?.(appContext) ?? {};
      return { component, prepared, matchData: match.match };
    });
    return entries;
  });

  const get = () => getEntries(history.location);
  const subscribe = (cb: (entries: RouterEntry[]) => void) =>
    history.listen(({ location }) => cb(getEntries(location)));

  return {
    history,
    historySource,
    get,
    subscribe,
  };
}
