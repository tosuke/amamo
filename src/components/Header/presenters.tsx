import css from 'styled-jsx/css';
import { SeaUser } from '@/models/SeaUser';
import { sizes, colors } from '@/theme';
import { Link } from '@/middlewares/router';
import type { Loadable } from '@/utils/Loadable';
import clsx from 'clsx';

export const Account: React.FC<{ user: Loadable<SeaUser> }> = ({ user }) => (
  <div className="account">
    <span>@{user.read().screenName}</span>
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
    font-size: calc(${sizes.minTappable} / 2);
    line-height: ${sizes.minTappable};
    text-align: center;
    color: rgba(${colors.textRaw}, 0.7);
    padding-bottom: 2px;
  }
  .button:hover {
    color: ${colors.text};
  }
  .button.active {
    color: ${colors.accent};
    border-bottom: 2px solid ${colors.accent};
  }
  .button :global(a) {
    display: block;
    width: 100%;
    height: 100%;
    color: inherit;
  }
`;

export const LinkIconButton: React.FC<{ href: string; iconName: string; active?: boolean; description?: string }> = ({
  href,
  iconName,
  active,
  description,
}) => {
  const icon = <i className={clsx('uil', `uil-${iconName}`)} />;
  return (
    <div className={clsx('button', active && 'active')} title={description}>
      <style jsx>{iconButtonStyles}</style>
      {active ? (
        <button>{icon}</button>
      ) : (
        <Link aria-label={description} href={href}>
          {icon}
        </Link>
      )}
    </div>
  );
};

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
export const ButtonGroup: React.FC = ({ children }) => (
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

export const HeaderPlaceholder = () => <HeaderLayout></HeaderLayout>;
