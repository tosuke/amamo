import ky from 'ky';
import parse from '@linkage-community/bottlemail';
import {
  assertIsInteger,
  assertIsObject,
  assertIsString,
  assertIsISO8601DateTime,
  assertIsNumber,
  assertIsArray,
} from '../_commons';
import { SeaUserId, SeaUser } from '@/models/SeaUser';
import { SeaFileId, SeaFile, SeaFileVariant } from '@/models/SeaFile';
import { SeaPostId, SeaPost } from '@/models/SeaPost';
import { Cache } from '@/cache';

const getUserKey = (u: SeaUser) => `entities/seaUsers/${u.id}`;
const getPostKey = (p: SeaPost) => `entities/seaPosts/${p.id}`;

// File
function assertIsSeaFileId(x: unknown, name = 'value'): asserts x is SeaFileId {
  assertIsInteger(x, name);
}

function toSeaFileVariant(json: unknown, root = 'res'): SeaFileVariant {
  assertIsObject(json, root);

  const id = json.id;
  assertIsInteger(id, `${root}.id`);

  const score = json.score;
  assertIsNumber(score, `${root}.score`);

  const extension = json.extension;
  assertIsString(extension, `${root}.extension`);

  const type = json.type;
  assertIsString(type, `${root}.type`);

  const size = json.size;
  assertIsNumber(size, `${root}.size`);

  const url = json.url;
  assertIsString(url, `${root}.url`);

  const mime = json.mime;
  assertIsString(mime, `${root}.mime`);

  return {
    id,
    score,
    extension,
    type,
    size,
    url,
    mime,
  } as const;
}

function toSeaFile(json: unknown, root = 'res'): SeaFile {
  assertIsObject(json, root);

  const id = json.id;
  assertIsSeaFileId(id, `${root}.id`);

  const name = json.name;
  assertIsString(name, `${root}.name`);

  const type = json.type;
  assertIsString(type, `${root}.type`);

  const variantJSONs = json.variants;
  assertIsArray(variantJSONs, `${root}.variants`);
  const variants = variantJSONs.map((v, i) => toSeaFileVariant(v, `${root}.variants[${i}]`));

  return {
    id,
    name,
    type,
    variants,
  } as const;
}

// User
function assertIsSeaUserId(x: unknown, name: string = 'value'): asserts x is SeaUserId {
  assertIsInteger(x, name);
}

function toUserRef(cache: Cache, json: unknown, root = 'res') {
  assertIsObject(json, root);

  const id = json.id;
  assertIsSeaUserId(id, `${root}.id`);

  const name = json.name;
  assertIsString(name, `${root}.name`);

  const screenName = json.screenName;
  assertIsString(screenName, `${root}.screenName`);

  const postsCount = json.postsCount;
  assertIsInteger(postsCount, `${root}.postsCount`);

  const createdAt = json.createdAt;
  assertIsISO8601DateTime(createdAt, `${root}.createdAt`);

  const updatedAt = json.updatedAt;
  assertIsISO8601DateTime(updatedAt, `${root}.updatedAt`);

  const avatarFile = json.avatarFile != null ? toSeaFile(json.avatarFile, `${root}.avatarFile`) : undefined;

  const user = {
    id,
    name,
    screenName,
    postsCount,
    createdAt,
    updatedAt,
    avatarFile,
  } as SeaUser;
  return cache.write(getUserKey, user);
}

// Post
function toPostRef(cache: Cache, json: unknown, root = 'res') {
  assertIsObject(json, `${root}`);

  const id = json.id;
  assertIsInteger(id, `${root}.id`);

  const text = json.text;
  assertIsString(text, `${root}.text`);
  const textNodes = parse(text);

  const author = toUserRef(cache, json.user, `${root}.user`);

  const createdAt = json.createdAt;
  assertIsISO8601DateTime(createdAt, `${root}.createdAt`);

  const updatedAt = json.updatedAt;
  assertIsISO8601DateTime(updatedAt, `${root}.updatedAt`);

  const fileJSONs = json.files ?? [];
  assertIsArray(fileJSONs, `${root}.files`);
  const files = fileJSONs.map((file, i) => toSeaFile(file, `${root}.files[${i}]`));

  const app = json.application;
  assertIsObject(app, `${root}.application`);

  const appName = app.name;
  assertIsString(appName, `${root}.application.name`);

  const appIsBot = app.isAutomated ?? false;
  if (typeof appIsBot !== 'boolean') throw new Error(`"${root}.application.isAutomated" must be boolean.`);

  const post: SeaPost = {
    id,
    text,
    textNodes,
    author,
    createdAt,
    updatedAt,
    files,
    via: {
      name: appName,
      isBot: appIsBot,
    },
  };

  return cache.write(getPostKey, post);
}

function toPostList(cache: Cache, json: unknown, root = 'res') {
  assertIsArray(json, root);
  const postRefs = json.map((p, i) => toPostRef(cache, p, `${root}[${i}]`));

  return postRefs;
}

export const createSeaApi = ({ cache, baseUrl, token }: Readonly<{ cache: Cache; baseUrl: string; token: string }>) => {
  const http = ky.create({
    prefixUrl: baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return Object.freeze({
    async fetchMe() {
      const json = await http.get('v1/account').json();
      return toUserRef(cache, json);
    },
    async fetchPublicTimelineLatestPosts(count: number, sinceId?: SeaPostId) {
      const searchParams = new URLSearchParams({ count: `${count}` });
      if (sinceId) searchParams.append('sinceId', `${sinceId}`);
      const json = await http.get('v1/timelines/public', { searchParams }).json();
      return toPostList(cache, json);
    },
  });
};

export type SeaApi = ReturnType<typeof createSeaApi>;
