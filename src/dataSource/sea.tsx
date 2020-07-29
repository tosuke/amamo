import { SeaUserId, SeaUser } from '@/models/SeaUser';
import { useCacheValue, CacheSetFn } from './_cache';
import { SeaApi } from '@/infra/sea';
import dayjs from 'dayjs';
import { memoize } from '@/utils/memoize';
import { Loadable } from '@/utils/Loadable';
import { createContext } from 'react';

/**
 * Reads sea user from cache.
 * Causes re-render on every cache updates. So child components should be wrapped with `React.memo`.
 * @param id
 */
export const useCachedSeaUser = (id: SeaUserId) => useCacheValue().seaUsers[id];

export const createSeaDataSource = ({ api, setCache }: Readonly<{ api: SeaApi; setCache: CacheSetFn }>) => {
  const updateUsers = (...users: SeaUser[]) =>
    setCache((cache) => {
      const needUpdateUsers = users.filter((u) => {
        const cached = cache.seaUsers[u.id];
        return !cached || dayjs(u.updatedAt).isAfter(cached.updatedAt);
      });
      if (needUpdateUsers.length === 0) return cache;
      const newUsers = needUpdateUsers.reduce((us, u) => ({ ...us, [u.id]: u }), cache.seaUsers);
      return {
        ...cache,
        seaUsers: newUsers,
      };
    });
  return {
    getMe: memoize(() =>
      Loadable.from(async () => {
        const { user } = await api.fetchMe();
        updateUsers(user);
        return user;
      })
    ),
  } as const;
};

export type SeaDataSource = ReturnType<typeof createSeaDataSource>;
