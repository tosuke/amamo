import { LoginedAppContext } from '@/app/context';

export const getPublicTimelineInitialProps = ({ api, cache }: LoginedAppContext) => {
  return {
    initialPosts: cache.query('PublicTimeline_initialPosts', () => api.fetchPublicTimelineLatestPosts(30)),
  };
};
