import React from 'react';
import { AppContext, isLogined } from '@/app/context';
import { RedirectToLogin } from '../_commons/RedirectToLogin';
import { SeaPostForm } from '@/components/PostForm/SeaPostForm';
import { SeaTimeline, getSeaTimelineInitialProps } from '@/components/Timeline/SeaTimeline';
import { Loadable } from '@/utils/Loadable';
import { usePublicTimelineStream } from '@/features/SeaPosts';

export const getInitialProps = (ctx: AppContext) => {
  if (isLogined(ctx)) {
    return {
      ...getSeaTimelineInitialProps(ctx),
    };
  }
};

const Home = ({ prepared }: { prepared: Loadable<ReturnType<typeof getInitialProps>> }) => {
  const preparedData = prepared.read();
  const { postStream } = usePublicTimelineStream();
  if (preparedData == null) return <RedirectToLogin />;
  return (
    <>
      <SeaPostForm />
      <SeaTimeline postsPager={preparedData.postsPager} postStream={postStream} />
    </>
  );
};

export default Home;
