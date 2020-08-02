import React from 'react';
import { TimelineContainer, TimelineItem } from '../presenters';
import type { getPublicTimelineInitialProps } from './getInitialProps';
import { SeaPostItem } from '@/components/Post/SeaPostItem';

export const PublicTimeline = ({ initialPosts }: ReturnType<typeof getPublicTimelineInitialProps>) => {
  const posts = initialPosts.read();
  return (
    <TimelineContainer>
      {posts.map((p) => (
        <TimelineItem key={p.key}>
          <SeaPostItem postRef={p} />
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};
