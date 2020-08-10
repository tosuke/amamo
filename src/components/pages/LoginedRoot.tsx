import React, { Suspense } from 'react';
import { AppContext } from '@/app/context';
import { DefaultLayout } from './_layout/DefaultLayout';
import { LoginedHeader, getLoginedHeaderInitialProps } from '../Header';
import { RedirectToLogin } from './_commons/RedirectToLogin';
import { getIsLogin } from '@/features/SeaAuth';

export const getLoginedRootInitialProps = (ctx: AppContext) => {
  if (getIsLogin(ctx.store)) {
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
