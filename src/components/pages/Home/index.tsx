import React from 'react';
import { AppState } from '@/appState';
import { getPublicTimelineInitialProps, PublicTimeline } from '@/components/Tilmeline/PublicTimeline';

export const getHomeInitialProps = (appState: AppState) => {
  return {
    ...getPublicTimelineInitialProps(appState),
  };
};

export const Home = ({ initialPosts }: ReturnType<typeof getHomeInitialProps>) => {
  return <PublicTimeline initialPosts={initialPosts} />;
};
