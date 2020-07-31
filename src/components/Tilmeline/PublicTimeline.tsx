import React from 'react';
import { TimelineContainer, TimelineItem } from './presenters';
import { AppContext } from '@/app/context';
import { useRefValue, Reference } from '@/cache';
import { SeaPost } from '@/models/SeaPost';

const PostItem: React.FC<{ postRef: Reference<SeaPost> }> = ({ postRef }) => {
  const post = useRefValue(postRef);
  return <>{post.text}</>;
};

export const getPublicTimelineInitialProps = ({ api, cache }: AppContext) => {
  return {
    initialPosts: cache.query('PublicTimeline_initialPosts', () => api.fetchPublicTimelineLatestPosts(30)),
  };
};

export const PublicTimeline = ({ initialPosts }: ReturnType<typeof getPublicTimelineInitialProps>) => {
  const posts = initialPosts.read();
  return (
    <TimelineContainer>
      {posts.map((p) => (
        <TimelineItem key={p.key}>
          <PostItem postRef={p} />
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};
