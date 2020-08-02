import { AppContext } from '@/app/context';

export const getPublicTimelineInitialProps = ({ api, cache }: AppContext) => {
  return {
    initialPosts: cache.query('PublicTimeline_initialPosts', () => api.fetchPublicTimelineLatestPosts(30)),
  };
};
