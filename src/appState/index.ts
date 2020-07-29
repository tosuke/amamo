import { createContext, useContext, useState, createElement } from 'react';
import { SeaDataSource, createSeaDataSource } from '@/dataSource';
import { CacheSetFn } from '@/dataSource/_cache';
import { Loadable } from '@/utils/Loadable';
import { SeaUser } from '@/models/SeaUser';
import { SeaApi } from '@/infra/sea';

export type AppState = {
  readonly seaDataSource: SeaDataSource;
  // コンポーネント設計の都合上行き場がない
  readonly seaAccount: Loadable<SeaUser>;
};

type InitialProps = Readonly<{
  api: SeaApi;
  setCache: CacheSetFn;
}>;

function getInitialState({ api, setCache }: InitialProps): AppState {
  const seaDataSource = createSeaDataSource({ api, setCache });
  const seaAccount = seaDataSource.getMe();
  return {
    seaDataSource,
    seaAccount,
  };
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export const useAppState = () => {
  const state = useContext(AppStateContext);
  if (process.env.NODE_ENV !== 'production' && state == null) {
    throw new Error('AppState is not provided.');
  }
  return state!;
};

export const AppStateProvider: React.FC<InitialProps> = ({ children, ...initialProps }) => {
  const [appState] = useState(() => getInitialState(initialProps));
  return createElement(AppStateContext.Provider, { value: appState }, children);
};
