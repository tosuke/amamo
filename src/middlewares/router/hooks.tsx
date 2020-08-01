import React, { useContext, unstable_useTransition as useTransition, TimeoutConfig, useState, useEffect } from 'react';
import { RouterContext } from './RouterContext';

const SUSPENSE_CONFIG: TimeoutConfig = { timeoutMs: 500 };

export function useRouter() {
  const router = useContext(RouterContext)!;

  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
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
