import { SeaApi, createSeaApi } from '@/infra/sea';
import { Cache } from '@/cache';
import { SimpleCache } from '@/cache/simpleCache';

/**
 * データ取得を駆動するためのオブジェクト
 */
export type AppContext = {
  readonly api: SeaApi;
  readonly cache: Cache;
};

export function createAppContext(): AppContext {
  const cache = new Cache(new SimpleCache());
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

export const appContext = createAppContext();
