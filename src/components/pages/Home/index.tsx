import React from 'react';
import type { getHomeInitialProps } from './getInitialProps';
import { RedirectToLogin } from '../_commons/RedirectToLogin';
import { SeaPostForm } from '@/components/PostForm/SeaPostForm';
import { PublicTimeline } from '@/components/Timeline/PublicTimeline';

const Home = ({ prepared }: { prepared: ReturnType<typeof getHomeInitialProps> }) => {
  if (prepared == null) return <RedirectToLogin />;
  return (
    <>
      <SeaPostForm />
      <PublicTimeline postsPager={prepared.postsPager} />
    </>
  );
};

export default Home;
