import React from 'react';
import { AppState } from '@/appState';

export const getSettingsInitialProps = (_appState: AppState) => {
  return {};
};

export const Settings = ({}: ReturnType<typeof getSettingsInitialProps>) => {
  return null;
};
