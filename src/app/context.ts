import { SeaApi, createSeaApi, getAccessToken } from '@/infra/sea';
import { Cache } from '@/middlewares/cache';
import { SimpleCache } from '@/middlewares/cache/simpleCache';
import { History, createBrowserHistory } from 'history';
import { Merge } from 'type-fest';

/**
 * データ取得を駆動するためのオブジェクト
 */
export type AppContext = {
  readonly api?: SeaApi;
  readonly cache: Cache;
  readonly history: History;
};

export type LoginedAppContext = Merge<AppContext, { api: SeaApi }>;

export function isLogined(ctx: AppContext): ctx is LoginedAppContext {
  return ctx.api != null;
}

let cache: Cache | undefined;
export function createAppContext(): AppContext {
  cache = cache ?? new Cache(new SimpleCache());
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
  };
}
