import { History, Location } from 'history';
import { AppContext } from '@/app/context';
import { unstable_createMutableSource } from 'react';
import { Route, PreparedRoute, MatchedRoute } from './routeBuilder';
import { Router } from './RouterContext';

export function createRouter(appContext: AppContext, routes: Route[], history: History): Router {
  const historySource = unstable_createMutableSource(history, () => history.location);

  let prevPath: string | undefined;
  let prevResult: PreparedRoute[] | undefined;
  const getEntries = (location: Location) => {
    const path = location.pathname;
    if (prevPath === path && prevResult != null) return prevResult;
    const matched = routes.reduce((prev, route) => {
      const result = route.match(path);
      return result.length > prev.length ? result : prev;
    }, [] as MatchedRoute[]);
    const prepared = matched.map((route) => route.prepare(appContext));

    prevPath = path;
    prevResult = prepared;
    return prepared;
  };

  const get = () => getEntries(history.location);
  const subscribe = (cb: (entries: PreparedRoute[]) => void) =>
    history.listen(({ location }) => cb(getEntries(location)));

  return {
    history,
    historySource,
    get,
    subscribe,
  };
}
