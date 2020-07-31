import React, { Suspense } from 'react';
import { AppContext } from '@/app/context';
import { DefaultLayout } from './_layout/DefaultLayout';
import { LoginedHeader, getLoginedHeaderInitialProps } from '../Header';

export const getLoginedRootInitialProps = (ctx: AppContext) => {
  return {
    ...getLoginedHeaderInitialProps(ctx),
  };
};

export const LoginedRoot: React.FC<Readonly<{ prepared: ReturnType<typeof getLoginedRootInitialProps> }>> = ({
  prepared,
  children,
}) => {
  return (
    <DefaultLayout headerContent={<LoginedHeader accountRef={prepared.accountRef} />}>
      <Suspense fallback="Loading...">{children}</Suspense>
    </DefaultLayout>
  );
};
