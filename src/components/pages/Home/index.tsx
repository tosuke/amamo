import React from 'react';
import { getPublicTimelineInitialProps, PublicTimeline } from '@/components/Tilmeline/PublicTimeline';
import { AppContext } from '@/app/context';

export const getHomeInitialProps = (appContext: AppContext) => {
  return {
    ...getPublicTimelineInitialProps(appContext),
  };
};

export const Home = ({ initialPosts }: ReturnType<typeof getHomeInitialProps>) => {
  return <PublicTimeline initialPosts={initialPosts} />;
};
