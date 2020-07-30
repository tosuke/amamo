import React from 'react';
import { AppState } from '@/appState';
import { TimelineContainer, TimelineItem } from './presenters';

export const getPublicTimelineInitialProps = ({ seaDataSource }: AppState) => {
  return {
    initialPosts: seaDataSource.fetchPublicTimelineLatestPosts(30),
  };
};

export const PublicTimeline = ({ initialPosts }: ReturnType<typeof getPublicTimelineInitialProps>) => {
  const posts = initialPosts.read();
  return (
    <TimelineContainer>
      {posts.map((p) => (
        <TimelineItem key={p.id}>{p.text}</TimelineItem>
      ))}
    </TimelineContainer>
  );
};
