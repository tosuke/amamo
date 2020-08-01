import { History, Location } from 'history';
import { AppContext } from '@/app/context';
import { createMutableSource } from 'react';
import { memoize } from '@/utils/memoize';
import { Route, PreparedRoute, MatchedRoute } from './routeBuilder';
import { Router } from './RouterContext';

export function createRouter(appContext: AppContext, routes: Route[], history: History): Router {
  const historySource = createMutableSource(history, () => history.location);

  const getEntries = memoize((location: Location) => {
    const path = location.pathname;
    const matched = routes.reduce((prev, route) => {
      const result = route.match(path);
      return result.length > prev.length ? result : prev;
    }, [] as MatchedRoute[]);
    const prepared = matched.map((route) => route.prepare(appContext));
    return prepared;
  });

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
