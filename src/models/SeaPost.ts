import { Opaque } from 'type-fest';
import type { NodeType } from '@linkage-community/bottlemail';
import { SeaUserId } from './SeaUser';
import { ISO8601DateTime } from './commons';
import { SeaFile } from './SeaFile';

export type SeaPostId = Opaque<number, 'SeaPostId'>;
export const seaPostId = (id: number) => id as SeaPostId;

export type SeaPost = {
  readonly id: SeaPostId;
  readonly text: string;
  readonly textNodes: readonly NodeType[];
  readonly author: SeaUserId;
  readonly createdAt: ISO8601DateTime;
  readonly updatedAt: ISO8601DateTime;
  readonly files: readonly SeaFile[];
  readonly via: {
    readonly name: string;
    readonly isBot: boolean;
  };
};
