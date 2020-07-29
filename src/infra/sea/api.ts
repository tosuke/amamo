import ky from 'ky';
import { SeaUserId, SeaUser } from '@/models/SeaUser';
import { assertIsInteger, assertIsObject, assertIsString, assertIsISO8601DateTime } from '../_commons';

function assertIsSeaUserId(x: unknown, name: string = 'value'): asserts x is SeaUserId {
  assertIsInteger(x, name);
}

function normalizeUserJSON(json: unknown, root = 'value') {
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

  return {
    user: {
      id,
      name,
      screenName,
      postsCount,
      createdAt,
      updatedAt,
    } as SeaUser,
  } as const;
}

export const createSeaApi = (baseUrl: string, token: string) => {
  const http = ky.create({
    prefixUrl: baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return Object.freeze({
    async fetchMe() {
      const json = await http.get('v1/account').json();
      return normalizeUserJSON(json);
    },
  });
};

export type SeaApi = ReturnType<typeof createSeaApi>;
