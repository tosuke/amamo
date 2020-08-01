import { createContext, MutableSource } from 'react';
import { History } from 'history';
import { PreparedRoute } from './routeBuilder';

export type Router = {
  readonly history: History;
  readonly historySource: MutableSource<History>;
  get(): PreparedRoute[];
  subscribe(cb: (entries: PreparedRoute[]) => void): () => void;
  // preload(href: string): void;
};

export const RouterContext = createContext<Router | undefined>(undefined);
RouterContext.displayName = 'RouterContext';
export const RouterProvider = RouterContext.Provider;
