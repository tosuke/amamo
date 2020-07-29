import React from 'react';
import { DefaultLayout } from '../_layout/DefaultLayout';
import { LoginedHeader } from '@/components/Header/Header';

export const Home = () => {
  return <DefaultLayout headerContent={<LoginedHeader />} />;
};
