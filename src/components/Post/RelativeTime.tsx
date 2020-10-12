import { useState, useMemo, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ISO8601DateTime } from '@/models/commons';

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}

class SharedInterval {
  private listeners = new Set<() => void>();
  private timerHandle: number | undefined;
  constructor(private intervalMs: number) {}

  subscribe(listener: () => void) {
    if (this.timerHandle == null) {
      this.timerHandle = window.setInterval(() => {
        this.listeners.forEach((f) => f());
      }, this.intervalMs);
    }
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        window.requestIdleCallback(() => {
          if (this.listeners.size === 0) {
            window.clearInterval(this.timerHandle);
            this.timerHandle = undefined;
          }
        });
      }
    };
  }
}

const relativeTimeInterval = new SharedInterval(1000);

function calcRelativeTime(dt: Dayjs, now: Dayjs) {
  const months = now.diff(dt, 'month');
  if (months > 0) return dt.format('YYYY-MM-DD');

  const days = now.diff(dt, 'day');
  if (days > 0) return `${days}d`;

  const hours = now.diff(dt, 'hour');
  if (hours > 0) return `${hours}h`;

  const minutes = now.diff(dt, 'minute');
  if (minutes > 0) return `${minutes}m`;

  const seconds = now.diff(dt, 'second');
  if (seconds > 0) return `${seconds}s`;

  return 'now';
}

export type RelativeTimeProps = {
  readonly time: ISO8601DateTime;
  readonly timeProvider?: () => Dayjs;
};
export const RelativeTime: React.FC<RelativeTimeProps> = ({ time, timeProvider = dayjs }) => {
  const dt = useMemo(() => dayjs(time), [time]);
  const absoluteTime = useMemo(() => dt.format('YYYY-MM-DD HH:mm'), [dt]);
  const [relativeTime, setRelativeTime] = useState(() => calcRelativeTime(dt, timeProvider()));
  useEffect(
    () =>
      relativeTimeInterval.subscribe(() => {
        setRelativeTime(calcRelativeTime(dt, timeProvider()));
      }),
    [dt, timeProvider],
  );
  return <div title={absoluteTime}>{relativeTime}</div>;
};
