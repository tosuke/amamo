import dayjs, { Dayjs } from 'dayjs';
import { ISO8601DateTime } from '@/models/commons';
import React, { useState, useMemo, useEffect } from 'react';

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
export const RelativeTime: React.FC<RelativeTimeProps> = ({ time, timeProvider }) => {
  const dt = useMemo(() => dayjs(time), [time]);
  const [relativeTime, setRelativeTime] = useState(() => calcRelativeTime(dt, timeProvider!()));
  useEffect(() => {
    const handle = window.setInterval(() => {
      setRelativeTime(calcRelativeTime(dt, timeProvider!()));
    }, 1000);
    return () => window.clearInterval(handle);
  }, [dt, timeProvider]);
  return <div title={dayjs(time).format('YYYY-MM-DD hh:mm')}>{relativeTime}</div>;
};
RelativeTime.defaultProps = {
  timeProvider: dayjs,
};
