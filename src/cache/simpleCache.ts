import { CacheStorage } from './index';
import { Loadable } from '@/utils/Loadable';

type CacheEntry = {
  value?: Loadable<unknown>;
  subscribers: Set<(value: Loadable<unknown>) => void>;
};

export class SimpleCache implements CacheStorage {
  private _version: number = 0;
  private map = new Map<string, CacheEntry>();

  get version() {
    return this._version;
  }

  get(key: string) {
    return this.map.get(key)?.value;
  }

  set(key: string, value: Loadable<unknown>) {
    const entry = this.map.get(key);
    if (entry != null) {
      if (entry?.value === value) return;
      this._version++;
      entry.value = value;
      entry.subscribers.forEach((f) => f(value));
    } else {
      this._version++;
      this.map.set(key, { value, subscribers: new Set() });
    }
  }

  subscribe(key: string, callback: (value: Loadable<unknown>) => void) {
    let entry = this.map.get(key);
    if (entry == null) {
      entry = { subscribers: new Set() };
    }
    entry.subscribers.add(callback);
    this.map.set(key, entry);
    return () => entry?.subscribers.delete(callback);
  }
}
