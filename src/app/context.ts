import { SeaApi, createSeaApi, getAccessToken } from '@/infra/sea';
import { Cache } from '@/middlewares/cache';
import { SimpleCache } from '@/middlewares/cache/simpleCache';
import { History, createBrowserHistory } from 'history';
import { Store } from '@/middlewares/store';

/**
 * データ取得を駆動するためのオブジェクト
 */
export type AppContext = {
  readonly api?: SeaApi;
  readonly cache: Cache;
  readonly history: History;
  readonly store: Store;
};

export const cache = new Cache(new SimpleCache());
export function createAppContext(store: Store): AppContext {
  const token = getAccessToken();
  const api = token
    ? createSeaApi({
        cache,
        baseUrl: process.env.API_ROOT!,
        token,
      })
    : undefined;
  const history = createBrowserHistory();
  return {
    api,
    cache,
    history,
    store,
  };
}
