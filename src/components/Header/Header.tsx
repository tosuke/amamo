import React from 'react';
import css from 'styled-jsx/css';
import { SeaUser } from '@/models/SeaUser';
import { sizes, colors } from '@/theme';
import { Link } from '@/middlewares/router';
import { LoginedAppContext } from '@/app/context';
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

const iconButtonStyles = css`
  .button {
    width: ${sizes.minTappable};
    height: ${sizes.minTappable};
    font-size: 20px;
    line-height: ${sizes.minTappable};
    text-align: center;
  }
  .button :global(a) {
    display: block;
    width: 100%;
    height: 100%;
    color: ${colors.accent};
  }
`;

export const SettingButton = () => (
  <div className="button">
    <style jsx>{iconButtonStyles}</style>
    <Link href="/settings">
      <i className="uil uil-cog" />
    </Link>
  </div>
);

export const SearchButton = () => (
  <div className="button">
    <style jsx>{iconButtonStyles}</style>
    <Link href="/search">
      <i className="uil uil-search" />
    </Link>
  </div>
);

const buttonGroupStyles = css`
  .button-group {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .button-group > :global(*) {
    margin-left: 8px;
  }
`;
const ButtonGroup: React.FC = ({ children }) => (
  <div className="button-group">
    <style jsx>{buttonGroupStyles}</style>
    {children}
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

export const getLoginedHeaderInitialProps = ({ api }: LoginedAppContext) => {
  return {
    accountLoadable: Loadable.resolve(api.fetchAccount()),
  } as const;
};

export const LoginedHeader = ({ accountLoadable }: ReturnType<typeof getLoginedHeaderInitialProps>) => {
  const account = accountLoadable.read();
  return (
    <HeaderLayout>
      <Account user={account} />
      <ButtonGroup>
        <SearchButton />
        <SettingButton />
      </ButtonGroup>
    </HeaderLayout>
  );
};

export const HeaderPlaceholder = () => <HeaderLayout></HeaderLayout>;

export const AuthHeader = () => <HeaderLayout />;
