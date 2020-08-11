import 'react';
declare module 'react' {
  export type SuspenseListRevealOrder = 'forwards' | 'backwards' | 'together';
  export type SuspenseListTailMode = 'collapsed' | 'hidden';

  export interface SuspenseListCommonProps {
    /**
     * Note that SuspenseList require more than one child;
     * it is a runtime warning to provide only a single child.
     *
     * It does, however, allow those children to be wrapped inside a single
     * level of `<React.Fragment>`.
     */
    children: ReactElement | Iterable<ReactElement>;
  }

  interface DirectionalSuspenseListProps extends SuspenseListCommonProps {
    /**
     * Defines the order in which the `SuspenseList` children should be revealed.
     */
    revealOrder: 'forwards' | 'backwards';
    /**
     * Dictates how unloaded items in a SuspenseList is shown.
     *
     * - By default, `SuspenseList` will show all fallbacks in the list.
     * - `collapsed` shows only the next fallback in the list.
     * - `hidden` doesn’t show any unloaded items.
     */
    tail?: SuspenseListTailMode;
  }

  interface NonDirectionalSuspenseListProps extends SuspenseListCommonProps {
    /**
     * Defines the order in which the `SuspenseList` children should be revealed.
     */
    revealOrder?: Exclude<SuspenseListRevealOrder, DirectionalSuspenseListProps['revealOrder']>;
    /**
     * The tail property is invalid when not using the `forwards` or `backwards` reveal orders.
     */
    tail?: never;
  }

  export type SuspenseListProps = DirectionalSuspenseListProps | NonDirectionalSuspenseListProps;

  /**
   * `SuspenseList` helps coordinate many components that can suspend by orchestrating the order
   * in which these components are revealed to the user.
   *
   * When multiple components need to fetch data, this data may arrive in an unpredictable order.
   * However, if you wrap these items in a `SuspenseList`, React will not show an item in the list
   * until previous items have been displayed (this behavior is adjustable).
   *
   * @see https://reactjs.org/docs/concurrent-mode-reference.html#suspenselist
   * @see https://reactjs.org/docs/concurrent-mode-patterns.html#suspenselist
   */
  export const SuspenseList: ExoticComponent<SuspenseListProps>;

  export interface TimeoutConfig {
    /**
     * This timeout (in milliseconds) tells React how long to wait before showing the next state.
     *
     * React will always try to use a shorter lag when network and device allows it.
     *
     * **NOTE: We recommend that you share Suspense Config between different modules.**
     */
    timeoutMs: number;
  }

  // must be synchronous
  export type TransitionFunction = () => void | undefined;
  // strange definition to allow vscode to show documentation on the invocation
  export interface TransitionStartFunction {
    /**
     * State updates caused inside the callback are allowed to be deferred.
     *
     * **If some state update causes a component to suspend, that state update should be wrapped in a transition.**
     *
     * @param callback A _synchronous_ function which causes state updates that can be deferred.
     */
    (callback: TransitionFunction): void;
  }

  /**
   * Returns a deferred version of the value that may “lag behind” it for at most `timeoutMs`.
   *
   * This is commonly used to keep the interface responsive when you have something that renders immediately
   * based on user input and something that needs to wait for a data fetch.
   *
   * A good example of this is a text input.
   *
   * @param value The value that is going to be deferred
   * @param config An optional object with `timeoutMs`
   *
   * @see https://reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue
   */
  export function useDeferredValue<T>(value: T, config?: TimeoutConfig | null): T;

  /**
   * Allows components to avoid undesirable loading states by waiting for content to load
   * before transitioning to the next screen. It also allows components to defer slower,
   * data fetching updates until subsequent renders so that more crucial updates can be
   * rendered immediately.
   *
   * The `useTransition` hook returns two values in an array.
   *
   * The first is a function that takes a callback. We can use it to tell React which state we want to defer.
   * The seconda boolean. It’s React’s way of informing us whether we’re waiting for the transition to finish.
   *
   * **If some state update causes a component to suspend, that state update should be wrapped in a transition.**
   *
   * @param config An optional object with `timeoutMs`
   *
   * @see https://reactjs.org/docs/concurrent-mode-reference.html#usetransition
   */
  export function unstable_useTransition(config?: TimeoutConfig | null): [TransitionStartFunction, boolean];

  export type MutableSourceVersion = unknown;
  export type MutableSourceGetSnapshotFn<Source, Snapshot> = (source: Source) => Snapshot;
  export type MutableSourceSubscribeFn<Source> = (source: Source, callback: () => void) => () => void;
  export type MutableSourceGetVersionFn = () => MutableSourceVersion;

  export interface MutableSource<Source> {
    readonly _source: Source;
  }

  export function createMutableSource<Source>(
    source: Source,
    getVersion: MutableSourceGetVersionFn
  ): MutableSource<Source>;

  /**
   * Select snapshot from `source`
   * @param source `MutableSource` to subscribe. should be memoized.
   * @param getSnapshot selector function
   * @param subscribe
   */
  export function useMutableSource<Source, Snapshot>(
    source: MutableSource<Source>,
    getSnapshot: MutableSourceGetSnapshotFn<Source, Snapshot>,
    subscribe: MutableSourceSubscribeFn<Source>
  ): Snapshot;
}
