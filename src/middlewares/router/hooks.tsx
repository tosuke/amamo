import React, { useContext, unstable_useTransition as useTransition, TimeoutConfig, useState, useEffect } from 'react';
import { RouterContext, RouterEntry } from './RouterContext';

const SUSPENSE_CONFIG: TimeoutConfig = { timeoutMs: 500 };

export function useRouter() {
  const router = useContext(RouterContext)!;

  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  const [entries, setEntries] = useState(router.get());

  useEffect(() => {
    // renderとcommitでlocationが変化していると変わってるので、初回だけチェックして適用する
    const currentEntries = router.get();
    if (entries !== currentEntries) setEntries(currentEntries);

    return router.subscribe((nextEntries) =>
      startTransition(() => {
        setEntries(nextEntries);
      })
    );
  }, [router, startTransition]);

  const node = entries.reduceRight(
    (prev, entry) => <RouteComponent {...entry}>{prev}</RouteComponent>,
    null as React.ReactNode
  );

  return {
    node,
    isPending,
  };
}

function RouteComponent({ component: Component, prepared, matchData, children }: React.PropsWithChildren<RouterEntry>) {
  return <Component prepared={prepared} matchData={matchData} children={children} />;
}

export function useHistory() {
  return useContext(RouterContext)!.history;
}
