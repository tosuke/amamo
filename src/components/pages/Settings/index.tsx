import React from 'react';
import { AppContext } from '@/app/context';

export const getSettingsInitialProps = (_appContext: AppContext) => {
  return {};
};

export const Settings = ({}: ReturnType<typeof getSettingsInitialProps>) => {
  return null;
};
