import { SeaApi, createSeaApi, getAccessToken } from '@/infra/sea';
import { History, createBrowserHistory } from 'history';
import { SetRequired } from 'type-fest';

/**
 * データ取得を駆動するためのオブジェクト
 */
export type AppContext = {
  readonly api?: SeaApi;
  // readonly cache: Cache;
  readonly history: History;
};

export type LoginedAppContext = SetRequired<AppContext, 'api'>;
export function isLogined(ctx: AppContext): ctx is LoginedAppContext {
  return ctx.api != null;
}

export function createAppContext(): AppContext {
  const token = getAccessToken();
  const api = token
    ? createSeaApi({
        baseUrl: process.env.API_ROOT!,
        websocketUrl: process.env.WS_ROOT!,
        token,
      })
    : undefined;
  const history = createBrowserHistory();
  return {
    api,
    history,
  };
}
