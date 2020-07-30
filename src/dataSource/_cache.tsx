import React, { createContext, useState, useContext } from 'react';
import { SeaUser } from '@/models/SeaUser';
import { SeaPost } from '@/models/SeaPost';

type CacheState = Readonly<{
  seaUsers: Readonly<Record<number, SeaUser | undefined>>;
  seaPosts: Readonly<Record<number, SeaPost | undefined>>;
}>;

export type CacheSetFn = React.Dispatch<React.SetStateAction<CacheState>>;

const defaultCacheState: CacheState = { seaUsers: {}, seaPosts: {} };

const CacheStateContext = createContext<CacheState>(defaultCacheState);
const CacheSetContext = createContext<CacheSetFn>(() => {}); // noop

export const CacheProvider: React.FC<{ defaultValue?: CacheState }> = ({ defaultValue, children }) => {
  const [cache, setCache] = useState<CacheState>(defaultValue ?? defaultCacheState);
  return (
    <CacheSetContext.Provider value={setCache}>
      <CacheStateContext.Provider value={cache}>{children}</CacheStateContext.Provider>
    </CacheSetContext.Provider>
  );
};

export const useCacheValue = () => useContext(CacheStateContext);
export const useCacheSet = () => useContext(CacheSetContext);
