import type { Opaque } from 'type-fest';
import { ISO8601DateTime } from './commons';

export type SeaUserId = Opaque<number, 'SeaUserId'>;
export const seaUserId = (id: number) => id as SeaUserId;

export type SeaUser = {
  readonly id: SeaUserId;
  readonly name: string;
  readonly screenName: string;
  readonly postsCount: number;
  readonly createdAt: ISO8601DateTime;
  readonly updatedAt: ISO8601DateTime;
  // TODO
  // readonly avatarFile: seaFileId
};
