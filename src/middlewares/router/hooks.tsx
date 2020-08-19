import React, {
  useContext,
  unstable_useTransition as useTransition,
  TimeoutConfig,
  useState,
  useEffect,
  unstable_useMutableSource as useMutableSource,
  MutableSourceSubscribeFn,
  MutableSourceGetSnapshotFn,
} from 'react';
import { History, Location } from 'history';
import { RouterContext } from './RouterContext';

const DEFAULT_SUSPENSE_CONFIG: TimeoutConfig = { timeoutMs: 3000 };

export function useRouter(suspenseConfig: TimeoutConfig = DEFAULT_SUSPENSE_CONFIG) {
  const router = useContext(RouterContext)!;

  const [startTransition, isPending] = useTransition(suspenseConfig);
  const [routes, setRoutes] = useState(router.get());

  useEffect(() => {
    // renderとcommitでlocationが変化していると変わってるので、初回だけチェックして適用する
    const currentRoutes = router.get();
    if (routes !== currentRoutes) setRoutes(currentRoutes);

    return router.subscribe((nextRoutes) =>
      startTransition(() => {
        setRoutes(nextRoutes);
      })
    );
  }, [router, startTransition]);

  const node = routes.reduceRight((prev, route) => route.render(prev), null as React.ReactNode);

  return {
    node,
    isPending,
  };
}

export function useHistory() {
  return useContext(RouterContext)!.history;
}

const getSnapshot: MutableSourceGetSnapshotFn<History, Location> = (history) => history.location;
const subscribe: MutableSourceSubscribeFn<History> = (history, callback) => history.listen(callback);
export function useLocation() {
  const { historySource } = useContext(RouterContext)!;
  return useMutableSource(historySource, getSnapshot, subscribe);
}
