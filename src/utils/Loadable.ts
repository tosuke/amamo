type State<T> =
  | {
      state: 'pending';
      promise: Promise<T>;
    }
  | {
      state: 'fulfilled';
      value: T;
    }
  | {
      state: 'rejected';
      error: unknown;
    };

const isPromiseLike = (x: unknown): x is PromiseLike<unknown> =>
  typeof x === 'object' && x != null && 'then' in x && typeof (x as any).then === 'function';

export class Loadable<T> implements PromiseLike<T> {
  private constructor(protected state: State<T>) {
    if (state.state === 'pending') {
      state.promise.then(
        (value) => (this.state = { state: 'fulfilled', value }),
        (error) => (this.state = { state: 'rejected', error })
      );
    }
  }

  static resolve<T>(valueOrPromise: T | PromiseLike<T>): Loadable<T> {
    // TODO: Check PromiseLike(Thenable)
    if (isPromiseLike(valueOrPromise)) {
      return new Loadable({ state: 'pending', promise: Promise.resolve(valueOrPromise) });
    } else {
      return new Loadable({ state: 'fulfilled', value: valueOrPromise });
    }
  }

  static reject(error: unknown): Loadable<never> {
    return new Loadable({ state: 'rejected', error });
  }

  static from<T>(fn: () => PromiseLike<T>): Loadable<T> {
    return new Loadable({ state: 'pending', promise: Promise.resolve(fn()) });
  }

  private static foreverLoadable: Loadable<never> | undefined;
  static forever<T = never>(): Loadable<T> {
    if (Loadable.foreverLoadable) return Loadable.foreverLoadable;
    return (Loadable.foreverLoadable = Loadable.resolve(
      new Promise<never>(() => {})
    ));
  }

  static waitAny(...loadables: Loadable<unknown>[]): Loadable<void> {
    const promises: Promise<unknown>[] = [];
    for (const loadable of loadables) {
      const state = loadable.state;
      switch (state.state) {
        case 'pending':
          promises.push(state.promise);
          break;
        case 'fulfilled':
          return Loadable.resolve<void>(undefined);
        case 'rejected':
          return Loadable.reject(state.error);
      }
    }
    return Loadable.resolve(Promise.race(promises).then(() => {}));
  }

  /**
   * Reads data from Loadable.
   * MUST be called within React Component, and may make the component suspend.
   */
  public read(): T {
    switch (this.state.state) {
      case 'pending':
        throw this.state.promise;
      case 'fulfilled':
        return this.state.value;
      case 'rejected':
        throw this.state.error;
    }
  }

  public then<TResult1 = T, TResult2 = never>(
    onFulfilled: (value: T) => TResult1 | PromiseLike<TResult1>,
    onRejected?: (error: unknown) => TResult2 | PromiseLike<TResult2>
  ): Loadable<TResult1 | TResult2> {
    try {
      switch (this.state.state) {
        case 'pending':
          return Loadable.resolve(this.state.promise.then(onFulfilled, onRejected));
        case 'fulfilled':
          return Loadable.resolve(onFulfilled(this.state.value));
        case 'rejected':
          return onRejected ? Loadable.resolve(onRejected(this.state.error)) : Loadable.reject(this.state.error);
      }
    } catch (e) {
      return Loadable.reject(e);
    }
  }
}
