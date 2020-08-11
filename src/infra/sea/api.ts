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
import { createContext, useContext } from 'react';

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
function toUser(json: unknown, root = 'res') {
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
  return user;
}

// Post
function assertIsSeaPostId(x: unknown, name: string = 'value'): asserts x is SeaPostId {
  assertIsInteger(x, name);
}
function normalizePost(json: unknown, root = 'res') {
  assertIsObject(json, `${root}`);

  const id = json.id;
  assertIsSeaPostId(id, `${root}.id`);

  const text = json.text;
  assertIsString(text, `${root}.text`);
  const textNodes = parse(text);

  const author = toUser(json.user, `${root}.user`);

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
    author: author.id,
    createdAt,
    updatedAt,
    files,
    via: {
      name: appName,
      isBot: appIsBot,
    },
  };

  return {
    post,
    user: author,
  };
}

function normalizePostList(json: unknown, root = 'res') {
  assertIsArray(json, root);
  const posts: SeaPost[] = [];
  const users = new Map<SeaUserId, SeaUser>();
  json.forEach((entry, idx) => {
    const { post, user } = normalizePost(entry, `${root}[${idx}]`);
    posts.push(post);
    users.set(user.id, user);
  });
  return {
    posts,
    users: [...users.values()],
  } as const;
}

export const createSeaApi = ({ baseUrl, token }: Readonly<{ baseUrl: string; token: string }>) => {
  const http = ky.create({
    prefixUrl: baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return Object.freeze({
    async fetchAccount() {
      const json = await http.get('v1/account').json();
      return toUser(json);
    },
    async fetchPublicTimeline(payload: Readonly<{ count?: number; since?: SeaPostId; after?: SeaPostId }>) {
      const params = new URLSearchParams();
      if (payload.count) params.append('count', `${payload.count}`);
      if (payload.since) params.append('sinceId', `${payload.since}`);
      if (payload.after) params.append('maxId', `${payload.after}`);
      const json = await http.get('v1/timelines/public', { searchParams: params }).json();
      return normalizePostList(json);
    },
    async fetchPost(id: SeaPostId) {
      try {
        const json = await http.get(`v1/posts/${id}`).json();
        return normalizePost(json);
      } catch (e) {
        if (e instanceof ky.HTTPError && e.response.status === 404) {
          return undefined;
        }
        throw e;
      }
    },
    async post(payload: Readonly<{ text: string; fileIds?: SeaFileId[]; inReplyToId?: SeaPostId }>) {
      const json = await http.post('v1/posts', { json: payload }).json();
      return normalizePost(json);
    },
  });
};

export type SeaApi = ReturnType<typeof createSeaApi>;

const SeaApiContext = createContext<SeaApi | undefined>(undefined);
SeaApiContext.displayName = 'SeaApiContext';

export const SeaApiProvider = SeaApiContext.Provider;

export const useSeaApi = () => useContext(SeaApiContext)!;
