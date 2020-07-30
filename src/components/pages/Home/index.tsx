import React from 'react';
import { DefaultLayout } from '../_layout/DefaultLayout';
import { LoginedHeader, getLoginedHeaderInitialProps } from '@/components/Header/Header';
import { AppState } from '@/appState';

export const getInitialProps = (appState: AppState) => {
  return {
    ...getLoginedHeaderInitialProps(appState),
  };
};

export const Home = ({ user }: ReturnType<typeof getInitialProps>) => {
  return <DefaultLayout headerContent={<LoginedHeader user={user} />} />;
};
