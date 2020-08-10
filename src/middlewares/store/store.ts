// A simple store inspired by recoil and riverpod

type Get = <T>(state: Atom<T>) => T;

export type Atom<T> = {
  readonly key: string;
  readonly init: T | ((get: Get) => T);
};

export function atom<T>(key: string, init: T | ((get: Get) => T)): Atom<T> {
  return { key, init };
}

type CacheEntry = { value?: any; subscribers: Set<(value: any) => void> };
export class Store {
  private _version: number = 0;
  private _cache = new Map<string, CacheEntry>();

  get version() {
    return this._version;
  }

  get<T>(state: Atom<T>): T {
    const entry = this._cache.get(state.key);
    if (entry?.value) {
      return entry.value;
    } else {
      this.reset(state);
      return this._cache.get(state.key)!.value;
    }
  }

  set<T>(state: Atom<T>, valueOrUpdate: T | ((prev: T) => T)): void {
    this._version++;
    const value =
      typeof valueOrUpdate !== 'function' ? valueOrUpdate : (valueOrUpdate as (prev: T) => T)(this.get(state));
    const entry = this._cache.get(state.key);
    if (entry) {
      entry.value = value;
      entry.subscribers.forEach((f) => f(value));
    } else {
      this._cache.set(state.key, { value, subscribers: new Set() });
    }
  }

  reset<T>(state: Atom<T>): void {
    const get: Get = (a) => this.get(a);
    const value = typeof state.init !== 'function' ? state.init : (state.init as (get: Get) => T)(get);
    this.set(state, value);
  }

  subscribe<T>(state: Atom<T>, callback: (value: T) => void): () => void {
    let entry = this._cache.get(state.key);
    if (entry == null) {
      entry = {
        subscribers: new Set([callback]),
      };
      this._cache.set(state.key, entry);
    } else {
      entry.subscribers.add(callback);
    }
    return () => entry?.subscribers.delete(callback);
  }
}
