import React from 'react';
import { PublicTimeline } from '@/components/Timeline/PublicTimeline';
import type { getHomeInitialProps } from './getInitialProps';

const Home = ({ prepared: { initialPosts } }: { prepared: ReturnType<typeof getHomeInitialProps> }) => {
  return <PublicTimeline initialPosts={initialPosts} />;
};

export default Home;
