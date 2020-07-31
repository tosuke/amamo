import { Opaque, Merge } from 'type-fest';
import type { NodeType } from '@linkage-community/bottlemail';
import { SeaUser } from './SeaUser';
import { ISO8601DateTime } from './commons';
import { SeaFile } from './SeaFile';
import { Reference } from '@/cache';

export type SeaPostId = Opaque<number, 'SeaPostId'>;
export const seaPostId = (id: number) => id as SeaPostId;

export type SeaPost = {
  readonly id: number;
  readonly text: string;
  readonly textNodes: readonly NodeType[];
  readonly author: Reference<SeaUser>;
  readonly createdAt: ISO8601DateTime;
  readonly updatedAt: ISO8601DateTime;
  readonly files: readonly SeaFile[];
  readonly via: {
    readonly name: string;
    readonly isBot: boolean;
  };
};

export type SeaPostJSON = Merge<SeaPost, { readonly author: SeaUser }>;
