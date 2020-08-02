import React from 'react';
import { AppContext } from '@/app/context';

const AccountSettings: React.FC = () => <form />;

export const getSettingsInitialProps = (_appContext: AppContext) => {
  return {};
};

const Settings = ({}: ReturnType<typeof getSettingsInitialProps>) => {
  return (
    <div className="settings">
      <style jsx>{`
        .settings {
          min-width: 60px;
          padding: 12px 24px;
        }
        .title {
          font-size: 180%;
          margin: 12px 0;
        }
        .subtitle {
          font-size: 140%;
          margin: 8px 0;
        }
        .text {
          display: inline-block;
          text-align: right;
          margin-right: 8px;
          min-width: 50px;
        }
      `}</style>
      <div className="title">設定</div>
      <form>
        <div className="subtitle">アカウント設定</div>
        <label></label>
        <div className="text">名前</div>
      </form>
    </div>
  );
};

export default Settings;
