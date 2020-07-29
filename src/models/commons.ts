import type { Opaque } from 'type-fest';

export type ISO8601DateTime = Opaque<string, 'ISO8601DateTime'>;
export const iso8601DateTime = (dateTime: string) => dateTime as ISO8601DateTime;
