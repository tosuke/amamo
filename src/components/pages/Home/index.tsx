import React from 'react';
import type { getHomeInitialProps } from './getInitialProps';
import { RedirectToLogin } from '../_commons/RedirectToLogin';
import { SeaPostForm } from '@/components/PostForm/SeaPostForm';
import { SeaTimeline } from '@/components/Timeline/SeaTimeline';

const Home = ({ prepared }: { prepared: ReturnType<typeof getHomeInitialProps> }) => {
  if (prepared == null) return <RedirectToLogin />;
  return (
    <>
      <SeaPostForm />
      <SeaTimeline postsPager={prepared.postsPager} />
    </>
  );
};

export default Home;
