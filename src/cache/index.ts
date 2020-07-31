import { Loadable } from '@/utils/Loadable';
import {
  MutableSource,
  createMutableSource,
  createContext,
  useContext,
  useMutableSource,
  useCallback,
  MutableSourceSubscribeFn,
} from 'react';
import { SimpleCache } from './simpleCache';

// FIXME: "Reference"は React の Ref と被っているので、よりよい名前を探す
export class Reference<T> {
  private _type!: T;
  constructor(readonly key: string) {}
}

export type EntityAdapter<T> = {
  getKey(value: T): string;
};

export type CacheStorage = {
  readonly version: number | string;
  get(key: string): Loadable<unknown> | undefined;
  set(key: string, value: Loadable<unknown>): void;
  subscribe(key: string, callback: (value: Loadable<unknown>) => void): () => void;
};

export class Cache {
  private _mutableSource: MutableSource<Cache>;
  constructor(private storage: CacheStorage) {
    this._mutableSource = createMutableSource(this, () => storage.version);
  }

  get mutableSource() {
    return this._mutableSource;
  }

  read<T>(ref: Reference<T>): Loadable<T> {
    return this.storage.get(ref.key)! as Loadable<any>;
  }

  subscribe<T>(ref: Reference<T>, callback: (value: Loadable<T>) => void): () => void {
    return this.storage.subscribe(ref.key, callback as any);
  }

  write<T>(getKey: (value: T) => string, value: T): Reference<T> {
    const key = getKey(value);
    this.storage.set(key, Loadable.resolve(value));
    return new Reference(key);
  }

  query<T>(key: string, fetcher: (prev?: Loadable<T>) => Promise<T> | T): Reference<T> {
    const prev = this.storage.get(key) as Loadable<T> | undefined;
    this.storage.set(
      key,
      Loadable.from(() => fetcher(prev))
    );
    return new Reference(key);
  }
}

const CacheContext = createContext<Cache | undefined>(undefined);
CacheContext.displayName = 'CacheContext';

export const CacheProvider = CacheContext.Provider;

export const useCache = () => useContext(CacheContext)!;

export const useRefValue = <T>(ref: Reference<T>): T => {
  const cache = useCache();
  const loadable = useMutableSource(
    cache.mutableSource,
    useCallback((c) => c.read(ref), [ref]),
    useCallback<MutableSourceSubscribeFn<Cache>>((c, cb) => c.subscribe(ref, cb), [ref])
  );
  return loadable.read();
};

export const cache = new Cache(new SimpleCache());
