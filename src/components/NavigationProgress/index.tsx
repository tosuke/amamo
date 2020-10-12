import { useState, useEffect, Suspense, lazy } from 'react';
import css from 'styled-jsx/css';
import { colors } from '@/theme';

const Line = lazy(() => import(/* webpackChunkName: "logined" */ './Line'));

const navigationProgressStyles = css`
  .navigation-progress {
    line-height: 0;
    height: 0;
  }
`;
const NavigationProgress: React.FC<{ isPending: boolean; timeoutMs: number }> = ({
  isPending: navigationPending,
  timeoutMs,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!navigationPending) {
      setIsPending(false);
      setPercent(0);
      return;
    }
    const startMs = performance.now();
    let frameRequestHandle: number | undefined;
    const onFrame: FrameRequestCallback = (time) => {
      setPercent(((time - startMs) / timeoutMs) * 100);
      frameRequestHandle = requestAnimationFrame(onFrame);
    };
    const timerHandle = window.setTimeout(() => {
      setIsPending(true);
      frameRequestHandle = requestAnimationFrame(onFrame);
    }, 500);
    return () => {
      window.clearTimeout(timerHandle);
      if (frameRequestHandle != null) cancelAnimationFrame(frameRequestHandle);
    };
  }, [navigationPending]);

  return (
    <div className="navigation-progress" hidden={!isPending}>
      <style jsx>{navigationProgressStyles}</style>
      <Suspense fallback={null}>
        <Line
          strokeLinecap="square"
          strokeWidth={0.3}
          strokeColor={colors.accent}
          trailColor="transparent"
          percent={percent}
        />
      </Suspense>
    </div>
  );
};

export default NavigationProgress;
