import { SeaPost, SeaPostId } from '@/models/SeaPost';
import { SeaUser } from '@/models/SeaUser';
import { SeaApi } from '@/infra/sea';
import { Loadable } from '@/utils/Loadable';
import { useState } from 'react';

type Page = Readonly<{
  posts: readonly SeaPost[];
  users: Record<number, SeaUser>;
  hasPrev: boolean;
  hasNext: boolean;
}>;

type Pager = Readonly<{
  initialData: Loadable<Page>;
  fetchAfter: (after: SeaPostId, count: number) => Promise<Page>;
}>;

export const createPager = (api: SeaApi, query?: string): Pager => {
  const fetchPublicTimeline = async (payload: Parameters<SeaApi['fetchPublicTimeline']>[0]) => {
    const { posts, users: userList } = await api.fetchPublicTimeline(
      query != null ? { ...payload, search: query } : payload
    );
    const users = userList.reduce((pre, u) => ({ ...pre, [u.id]: u }), {} as Record<number, SeaUser>);
    return {
      posts,
      users,
    };
  };
  return {
    initialData: Loadable.from(async () => {
      const data = await fetchPublicTimeline({ count: 30 });
      return {
        ...data,
        hasPrev: false,
        hasNext: data.posts.length === 30,
      };
    }),
    fetchAfter: async (after: SeaPostId, count: number) => {
      const data = await fetchPublicTimeline({ after, count });
      return {
        ...data,
        hasPrev: true,
        hasNext: data.posts.length === count,
      };
    },
  };
};

export const usePager = (pager: Pager) => {
  const [prevPager, setPrevPager] = useState(pager);
  const [data, setData] = useState(pager.initialData.read());
  if (prevPager !== pager) {
    setPrevPager(pager);
    setData(pager.initialData.read());
  }

  const [loadingNext, setLoadingNext] = useState(false);
  const loadNext = async (count: number) => {
    if (loadingNext || !data.hasNext) return;
    try {
      setLoadingNext(true);
      const page = await pager.fetchAfter(data.posts[data.posts.length - 1].id, count);
      setData((prev) => ({
        ...prev,
        users: { ...prev.users, ...page.users },
        posts: [...prev.posts, ...page.posts],
        hasNext: page.hasNext,
      }));
    } finally {
      setLoadingNext(false);
    }
  };
  return {
    ...data,
    loadingNext,
    loadNext,
  };
};
