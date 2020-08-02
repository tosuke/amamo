import React from 'react';
import { SeaUser } from '@/models/SeaUser';
import { sizes, colors } from '@/theme';
import { Link } from '@/middlewares/router';
import { LoginedAppContext } from '@/app/context';
import { useRefValue, Reference } from '@/middlewares/cache';
import { Loadable } from '@/utils/Loadable';

export const Account: React.FC<{ user: SeaUser }> = ({ user }) => (
  <div className="account">
    <span>@{user.screenName}</span>
    <style jsx>{`
      .account {
        font-size: 16px;
      }
    `}</style>
  </div>
);

export const SettingButton = () => (
  <div className="setting">
    <Link href="/settings">
      <i className="uil uil-cog" />
    </Link>
    <style jsx>{`
      .setting {
        width: ${sizes.minTappable};
        height: ${sizes.minTappable};
        font-size: 20px;
        line-height: ${sizes.minTappable};
        text-align: center;
      }
      .setting a {
        display: block;
        width: 100%;
        height: 100%;
        color: ${colors.accent};
      }
    `}</style>
  </div>
);

export const HeaderLayout: React.FC = ({ children }) => (
  <header className="header-wrapper">
    <div className="header">{children}</div>
    <style jsx>{`
      .header-wrapper {
        width: 100%;
        height: 64px;
        background-color: ${colors.foreground};
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.04), 0 0 16px 0 rgba(0, 0, 0, 0.04);
      }
      .header {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 720px;
        height: 100%;
        margin: 0 auto;
        padding: 0 12px;
      }
    `}</style>
  </header>
);

export const getLoginedHeaderInitialProps = ({ cache, api }: LoginedAppContext) => {
  const accountRef = cache.query(
    'LoginedHeader_account',
    (prev?: Loadable<Reference<SeaUser>>) => prev?.get() ?? api.fetchMe()
  );
  return {
    accountRef,
  } as const;
};

export const LoginedHeader = ({ accountRef }: ReturnType<typeof getLoginedHeaderInitialProps>) => {
  const account = useRefValue(accountRef.read());
  return (
    <HeaderLayout>
      <Account user={account} />
      <SettingButton />
    </HeaderLayout>
  );
};

export const HeaderPlaceholder = () => <HeaderLayout></HeaderLayout>;

export const AuthHeader = () => <HeaderLayout />;
