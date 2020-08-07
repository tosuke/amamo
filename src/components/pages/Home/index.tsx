import React from 'react';
import { PublicTimeline } from '@/components/Timeline/PublicTimeline';
import type { getHomeInitialProps } from './getInitialProps';
import { RedirectToLogin } from '../_commons/RedirectToLogin';

const Home = ({ prepared }: { prepared: ReturnType<typeof getHomeInitialProps> }) => {
  if (prepared == null) return <RedirectToLogin />;
  return <PublicTimeline postsPager={prepared.postsPager} />;
};

export default Home;
