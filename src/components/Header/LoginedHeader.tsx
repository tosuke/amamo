import { Suspense } from 'react';
import { useLocation } from '@/middlewares/router';
import { LoginedAppContext } from '@/app/context';
import { Loadable } from '@/utils/Loadable';
import { HeaderLayout, ButtonGroup, Account, LinkIconButton } from './presenters';

export const getLoginedHeaderInitialProps = ({ api }: LoginedAppContext) => {
  return {
    accountLoadable: Loadable.resolve(api.fetchAccount()),
  } as const;
};

export const LoginedHeader = ({ accountLoadable }: ReturnType<typeof getLoginedHeaderInitialProps>) => {
  const { pathname } = useLocation();
  return (
    <HeaderLayout>
      <Suspense fallback={<div aria-hidden />}>
        <Account user={accountLoadable} />
      </Suspense>
      <ButtonGroup>
        <LinkIconButton href="/" active={pathname === '/'} iconName="home-alt" description="ホーム" />
        <LinkIconButton href="/search" active={pathname === '/search'} iconName="search" description="検索" />
        <LinkIconButton href="/settings" active={pathname === '/settings'} iconName="cog" description="設定" />
      </ButtonGroup>
    </HeaderLayout>
  );
};
