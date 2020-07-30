import React, { Suspense } from 'react';
import { DefaultLayout } from '../_layout/DefaultLayout';
import { LoginedHeader, getLoginedHeaderInitialProps, HeaderPlaceholder } from '@/components/Header/Header';
import { AppState } from '@/appState';
import { getPublicTimelineInitialProps, PublicTimeline } from '@/components/Tilmeline/PublicTimeline';

export const getHomeInitialProps = (appState: AppState) => {
  return {
    ...getLoginedHeaderInitialProps(appState),
    ...getPublicTimelineInitialProps(appState),
  };
};

export const Home = ({ user, initialPosts }: ReturnType<typeof getHomeInitialProps>) => {
  return (
    <DefaultLayout
      headerContent={
        <Suspense fallback={<HeaderPlaceholder />}>
          <LoginedHeader user={user} />
        </Suspense>
      }
    >
      <PublicTimeline initialPosts={initialPosts} />
    </DefaultLayout>
  );
};
