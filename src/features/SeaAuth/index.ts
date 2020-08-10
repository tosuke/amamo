import { atom, useStoredValue, Store, useStore } from '@/middlewares/store';
import { SeaApi, createSeaApi, getAccessToken } from '@/infra/sea';
import { useState, useEffect, createElement, Fragment } from 'react';
import { Cache } from '@/middlewares/cache';

const seaApiCredential = atom<{ token: string; baseUrl: string } | undefined>('sea-credential', undefined);

export const seaApiAtom = atom<SeaApi | undefined>('sea-api', undefined);

export const useSeaApi = () => useStoredValue(seaApiAtom)!;
export const getSeaApi = (store: Store) => store.get(seaApiAtom)!;
export const getIsLogin = (store: Store) => store.get(seaApiAtom) != null;

export const SeaApiProvider = (props: React.PropsWithChildren<{ cache: Cache }>) => {
  const [pending, setPending] = useState(true);
  const store = useStore();
  useEffect(() => {
    const token = getAccessToken();
    const baseUrl = process.env.API_ROOT!;
    if (token) {
      store.set(seaApiAtom, createSeaApi({ cache: props.cache, baseUrl, token }));
    }
    setPending(false);
  }, [store, props.cache]);
  return createElement(Fragment, {}, pending || props.children);
};
