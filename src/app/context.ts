import { SeaApi, createSeaApi } from '@/infra/sea';
import { Cache, cache } from '@/cache';

/**
 * データ取得を駆動するためのオブジェクト
 */
export type AppContext = {
  readonly api: SeaApi;
  readonly cache: Cache;
};

export function createAppContext(): AppContext {
  const api = createSeaApi(process.env.API_ROOT!, process.env.TOKEN!);
  return {
    api,
    cache,
  };
}
