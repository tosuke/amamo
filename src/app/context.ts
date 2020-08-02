import { SeaApi, createSeaApi } from '@/infra/sea';
import { Cache } from '@/middlewares/cache';
import { SimpleCache } from '@/middlewares/cache/simpleCache';

/**
 * データ取得を駆動するためのオブジェクト
 */
export type AppContext = {
  readonly api: SeaApi;
  readonly cache: Cache;
};

let cache: Cache | undefined;
export function createAppContext(): AppContext {
  cache = cache ?? new Cache(new SimpleCache());
  const api = createSeaApi({
    cache,
    baseUrl: process.env.API_ROOT!,
    token: process.env.TOKEN!,
  });
  return {
    api,
    cache,
  };
}
