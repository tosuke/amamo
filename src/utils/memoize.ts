const shallowArrayEqual = (a: unknown[], b: unknown[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const memoize = <F extends (...params: any[]) => any>(fn: F): F => {
  let prevState:
    | Readonly<{
        params: Parameters<F>;
        result: ReturnType<F>;
      }>
    | undefined;
  return ((...params: Parameters<F>): ReturnType<F> => {
    if (prevState != null && shallowArrayEqual(params, prevState.params)) return prevState.result;
    const result = fn(...params);
    prevState = {
      params,
      result,
    };
    return result;
  }) as F;
};
