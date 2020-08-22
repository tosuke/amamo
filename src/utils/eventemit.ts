type Handler<T> = (value: T) => void;

export type Emitter<T> = {
  size: number;
  subscribe(handler: Handler<T>): () => void;
};

export function eventemit<T>(): [(value: T) => void, Emitter<T>] {
  const set = new Set<Handler<T>>();

  const emit = (value: T) => {
    set.forEach((h) => h(value));
  };

  const emitter: Emitter<T> = {
    get size() {
      return set.size;
    },
    subscribe(handler: Handler<T>) {
      set.add(handler);
      return () => set.delete(handler);
    },
  };

  return [emit, emitter];
}
