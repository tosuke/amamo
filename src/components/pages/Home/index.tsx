import React, { Suspense } from 'react';
import { DefaultLayout } from '../_layout/DefaultLayout';
import { LoginedHeader, getLoginedHeaderInitialProps } from '@/components/Header/Header';
import { AppState } from '@/appState';
import { getPublicTimelineInitialProps, PublicTimeline } from '@/components/Tilmeline/PublicTimeline';

export const getInitialProps = (appState: AppState) => {
  return {
    ...getLoginedHeaderInitialProps(appState),
    ...getPublicTimelineInitialProps(appState),
  };
};

export const Home = ({ user, initialPosts }: ReturnType<typeof getInitialProps>) => {
  return (
    <DefaultLayout headerContent={<LoginedHeader user={user} />}>
      <Suspense fallback="loading...">
        <PublicTimeline initialPosts={initialPosts} />
      </Suspense>
    </DefaultLayout>
  );
};
