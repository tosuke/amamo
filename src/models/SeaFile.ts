import { Opaque, LiteralUnion } from 'type-fest';

export type SeaFileId = Opaque<number, 'SeaFileId'>;
export const seaFileId = (id: number) => id as SeaFileId;

/**
 * Fileの持つ個々のリソース
 */
export type SeaFileVariant = {
  readonly id: number;
  readonly score: number;
  readonly extension: string;
  readonly type: LiteralUnion<'thumbnail' | 'image' | 'video', string>;
  readonly size: number;
  readonly url: string;
  readonly mime: string;
};

export type SeaFile = {
  readonly id: SeaFileId;
  readonly name: string;
  readonly type: LiteralUnion<'image' | 'video', string>;
  readonly variants: readonly SeaFileVariant[];
};

export const filterThumbnailVariants = (file: SeaFile) => file.variants.filter((v) => v.type === 'thumbnail');
export const filterImageVariants = (file: SeaFile) => file.variants.filter((v) => v.type === 'image');
export const filterVideoVariants = (file: SeaFile) => file.variants.filter((v) => v.type === 'video');
