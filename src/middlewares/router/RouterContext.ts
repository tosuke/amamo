import { createContext, MutableSource } from 'react';
import { History } from 'history';
import { MatchedRoute } from 'react-router-config';

type Params = Record<string, string | undefined>;

export type RouterEntry = {
  component: React.ComponentType<Record<string, unknown>>;
  prepared: Record<string, unknown>;
  matchData: MatchedRoute<Params>['match'];
};

export type Router = {
  readonly history: History;
  readonly historySource: MutableSource<History>;
  get(): RouterEntry[];
  subscribe(cb: (entries: RouterEntry[]) => void): () => void;
  // preload(href: string): void;
};

export const RouterContext = createContext<Router | undefined>(undefined);
RouterContext.displayName = 'RouterContext';
export const RouterProvider = RouterContext.Provider;
