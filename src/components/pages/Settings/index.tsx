import React from 'react';
import { AppState } from '@/appState';
import { getLoginedHeaderInitialProps, LoginedHeader } from '@/components/Header/Header';
import { DefaultLayout } from '../_layout/DefaultLayout';

export const getSettingsInitialProps = (appState: AppState) => {
  return {
    ...getLoginedHeaderInitialProps(appState),
  };
};

export const Settings = ({ user }: ReturnType<typeof getSettingsInitialProps>) => {
  return <DefaultLayout headerContent={<LoginedHeader user={user} />} />;
};
