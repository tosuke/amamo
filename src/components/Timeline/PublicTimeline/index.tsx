import React from 'react';
import { TimelineContainer, TimelineItem } from '../presenters';
import { useRefValue, Reference } from '@/middlewares/cache';
import { SeaPost } from '@/models/SeaPost';
import type { getPublicTimelineInitialProps } from './getInitialProps';

const PostItem: React.FC<{ postRef: Reference<SeaPost> }> = ({ postRef }) => {
  const post = useRefValue(postRef);
  return <>{post.text}</>;
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
