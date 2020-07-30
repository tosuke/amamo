import { SeaUserId, SeaUser } from '@/models/SeaUser';
import { useCacheValue, CacheSetFn } from './_cache';
import { SeaApi } from '@/infra/sea';
import { Loadable } from '@/utils/Loadable';
import { SeaPost, SeaPostId } from '@/models/SeaPost';

/**
 * Reads sea user from cache.
 * Causes re-render on every cache updates. So child components should be wrapped with `React.memo`.
 * @param id
 */
export const useCachedSeaUser = (id: SeaUserId) => useCacheValue().seaUsers[id];

export const createSeaDataSource = ({ api, setCache }: Readonly<{ api: SeaApi; setCache: CacheSetFn }>) => {
  const updateUsers = (users: Readonly<Record<number, SeaUser | undefined>>) =>
    setCache((cache) => {
      return {
        ...cache,
        seaUsers: {
          ...cache.seaUsers,
          ...users,
        },
      };
    });
  const updatePosts = (...posts: SeaPost[]) =>
    setCache((cache) => {
      const newPosts = posts.reduce((ps, p) => ({ ...ps, [p.id]: p }), cache.seaPosts);
      return {
        ...cache,
        seaPosts: newPosts,
      };
    });
  return {
    getMe: () =>
      Loadable.from(async () => {
        const { user } = await api.fetchMe();
        updateUsers({ [user.id]: user });
        return user;
      }),
    fetchPublicTimelineLatestPosts: (count: number, sinceId?: SeaPostId) =>
      Loadable.from(async () => {
        const { users, posts } = await api.fetchPublicTimelineLatestPosts(count, sinceId);
        updateUsers(users);
        updatePosts(...posts);
        return posts;
      }),
  } as const;
};

export type SeaDataSource = ReturnType<typeof createSeaDataSource>;
