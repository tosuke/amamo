export * from './auth';

import { createContext, useContext } from 'react';
import type { createSeaApi as originalCreateSeaApi, SeaApi } from './api';

const SeaApiContext = createContext<SeaApi | undefined>(undefined);
SeaApiContext.displayName = 'SeaApiContext';

export const SeaApiProvider = SeaApiContext.Provider;

export const useSeaApi = () => useContext(SeaApiContext)!;

export const createSeaApi: typeof originalCreateSeaApi = (...args) => {
  const api = import(/* webpackChunkName: "logined" */ './api').then((mod) => mod.createSeaApi(...args));
  const proxy: SeaApi = {
    fetchAccount() {
      return api.then((a) => a.fetchAccount());
    },
    fetchPost(...args) {
      return api.then((a) => a.fetchPost(...args));
    },
    fetchPublicTimeline(...args) {
      return api.then((a) => a.fetchPublicTimeline(...args));
    },
    post(...args) {
      return api.then((a) => a.post(...args));
    },
  };
  return proxy;
};
