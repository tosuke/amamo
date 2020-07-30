import { SeaUserId, SeaUser } from '@/models/SeaUser';
import { useCacheValue, CacheSetFn } from './_cache';
import { SeaApi } from '@/infra/sea';
import dayjs from 'dayjs';
import { memoize } from '@/utils/memoize';
import { Loadable } from '@/utils/Loadable';

/**
 * Reads sea user from cache.
 * Causes re-render on every cache updates. So child components should be wrapped with `React.memo`.
 * @param id
 */
export const useCachedSeaUser = (id: SeaUserId) => useCacheValue().seaUsers[id];

export const createSeaDataSource = ({ api, setCache }: Readonly<{ api: SeaApi; setCache: CacheSetFn }>) => {
  const updateUsers = (...users: SeaUser[]) =>
    setCache((cache) => {
      const newUsers = users.reduce((us, u) => {
        const old = us[u.id];
        if (old && (dayjs(u.updatedAt).isBefore(old.updatedAt) || u.postsCount < old.postsCount)) return us;
        return { ...us, [u.id]: u };
      }, {} as Record<number, SeaUser | undefined>);
      return {
        ...cache,
        seaUsers: {
          ...cache.seaUsers,
          ...newUsers,
        },
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
