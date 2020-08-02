import React, { Suspense } from 'react';
import { AppContext, isLogined } from '@/app/context';
import { DefaultLayout } from './_layout/DefaultLayout';
import { LoginedHeader, getLoginedHeaderInitialProps } from '../Header';
import { RedirectToLogin } from './_commons/RedirectToLogin';

export const getLoginedRootInitialProps = (ctx: AppContext) => {
  if (isLogined(ctx)) {
    return {
      ...getLoginedHeaderInitialProps(ctx),
    };
  }
};

export const LoginedRoot: React.FC<Readonly<{ prepared: ReturnType<typeof getLoginedRootInitialProps> }>> = ({
  prepared,
  children,
}) => {
  if (prepared == null) return <RedirectToLogin />;
  return (
    <DefaultLayout headerContent={<LoginedHeader accountRef={prepared.accountRef} />}>
      <Suspense fallback="Loading...">{children}</Suspense>
    </DefaultLayout>
  );
};
