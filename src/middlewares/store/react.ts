import {
  createElement,
  createContext,
  createMutableSource,
  MutableSource,
  useContext,
  useMemo,
  useMutableSource,
  useCallback,
} from 'react';
import { Store, Atom } from './store';

const StoreContext = createContext<readonly [Store, MutableSource<Store>] | undefined>(undefined);
StoreContext.displayName = 'StoreContext';

const useStoreContext = () => {
  const value = useContext(StoreContext);
  if (value == null) {
    throw new Error('use store within <StoreProivider/>.');
  }
  return value;
};

export const StoreProivider: React.FC<{ store: Store }> = ({ store, children }) => {
  const value = useMemo(() => [store, createMutableSource(store, () => store.version)] as const, [store]);
  return createElement(StoreContext.Provider, { value }, children);
};

export function useStore() {
  return useStoreContext()[0];
}

export function useStoredValue<T>(state: Atom<T>) {
  const source = useStoreContext()[1];
  return useMutableSource(
    source,
    useCallback((store) => store.get(state), [state.key]),
    useCallback((store, callback) => store.subscribe(state, callback), [state])
  );
}
