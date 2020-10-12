import { Suspense } from 'react';
import { AppContext, isLogined } from '@/app/context';
import { DefaultLayout } from './_layout/DefaultLayout';
import { LoginedHeader, getLoginedHeaderInitialProps } from '@/components/Header/LoginedHeader';
import { RedirectToLogin } from './_commons/RedirectToLogin';
import { Loadable } from '@/utils/Loadable';

export const getLoginedRootInitialProps = (ctx: AppContext) => {
  if (isLogined(ctx)) {
    return {
      ...getLoginedHeaderInitialProps(ctx),
    };
  }
};

const LoginedRoot: React.FC<Readonly<{ prepared: Loadable<ReturnType<typeof getLoginedRootInitialProps>> }>> = ({
  prepared,
  children,
}) => {
  const preparedData = prepared.read();
  if (preparedData == null) return <RedirectToLogin />;
  return (
    <DefaultLayout headerContent={<LoginedHeader accountLoadable={preparedData.accountLoadable} />}>
      <Suspense fallback="Loading...">{children}</Suspense>
    </DefaultLayout>
  );
};

export default LoginedRoot;
