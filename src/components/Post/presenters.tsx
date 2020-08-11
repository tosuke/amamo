import React, { useMemo } from 'react';
import css from 'styled-jsx/css';
import clsx from 'clsx';
import { colors } from '@/theme';

// avatars

const avatarStyles = css`
  .avatar {
    border-radius: 4px;
    width: 36px;
    height: 36px;
  }
  img.avatar {
    object-fit: cover;
  }
  svg.avatar rect {
    fill: ${colors.background};
  }
  .no-select {
    user-select: none;
  }
`;

export const IconAvatar: React.FC<{ title: string; sources: React.ReactNode }> = ({ title, sources }) => (
  <picture>
    <style jsx>{avatarStyles}</style>
    {sources}
    <img className="avatar" title={title} />
  </picture>
);

export const TextAvatar: React.FC<{ name: string }> = ({ name }) => (
  <svg className="avatar">
    <style jsx>{avatarStyles}</style>
    <rect width="100%" height="100%" />
    <text x="50%" y="50%" textAnchor="middle" fontStyle="bold" dominantBaseline="central" className="no-select">
      {[...name].slice(0, 1).join('').toUpperCase()}
    </text>
  </svg>
);

// Body Text Elements

const bodyTextStyle = css`
  .body {
    margin: 4px 0;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
`;
export const PostBodyTextWrapper: React.FC = ({ children }) => (
  <div className="body">
    <style jsx>{bodyTextStyle}</style>
    {children}
  </div>
);

const boldStyle = css`
  .bold {
    font-weight: 700;
  }
`;
export const BoldText: React.FC<{ className?: string }> = ({ className, children }) => (
  <span className={clsx('bold', className)}>
    <style jsx>{boldStyle}</style>
    {children}
  </span>
);

export const LinkText: React.FC<{ href: string; className?: string }> = ({ href, className }) => {
  const content = useMemo(() => {
    try {
      return decodeURI(href);
    } catch {
      return href;
    }
  }, [href]);
  return (
    <a className={className} href={href} rel="noopener noreferrer" target="_target">
      {content}
    </a>
  );
};

// Layouts
const postFooterStyle = css`
  .footer {
    display: inline-flex;
    align-items: center;
    margin: 4px 0 0;
    color: ${colors.caption};
    font-size: 0.8em;
  }
`;
export const PostFooter: React.FC = ({ children }) => (
  <div className="footer">
    <style jsx>{postFooterStyle}</style>
    {children}
  </div>
);

const postFooterBadgeStyle = css`
  .badge {
    box-sizing: border-box;
    border: 1px solid ${colors.caption};
    border-radius: 4px;
    margin-left: 4px;
    padding: 2px;
    font-size: 0.7em;
  }
`;
export const PostFooterBadge: React.FC = ({ children }) => (
  <span className="badge">
    <style jsx>{postFooterBadgeStyle}</style>
    {children}
  </span>
);

const postFileListStyle = css`
  .files {
    display: flex;
    overflow-x: auto;
    margin: 4px 0;
  }
`;
export const PostFileList: React.FC = ({ children }) => (
  <div className="files">
    <style jsx>{postFileListStyle}</style>
    {children}
  </div>
);

const postFileStyles = css`
  .file {
    padding-right: 4px;
    position: relative;
  }

  .file img {
    width: 144px;
    height: 144px;
    border-radius: 4px;
    object-fit: cover;
  }

  .cover {
    display: flex;
    position: absolute;
    pointer-events: none;
    justify-content: center;
    align-items: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .cover span {
    font-size: 2em;
    position: absolute;
    opacity: 0.8;
    color: ${colors.caption};
    background-color: ${colors.background};
    border-radius: 4px;
  }
`;

export const PostNothingItem: React.FC = () => (
  <div className="file">
    <style jsx>{postFileStyles}</style>
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
    <div className="cover">😢</div>
  </div>
);

export const PostImageItem: React.FC<{ title: string; sources: React.ReactNode }> = ({ title, sources }) => (
  <div className="file">
    <style jsx>{postFileStyles}</style>
    <picture>
      {sources}
      <img title={title} />
    </picture>
  </div>
);

export const PostVideoItem: React.FC<{ title: string; sources: React.ReactNode }> = ({ title, sources }) => (
  <div className="file">
    <style jsx>{postFileStyles}</style>
    <picture>
      {sources}
      <img title={title} />
    </picture>
  </div>
);

const postItemLayoutStyles = css`
  .post {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-column-gap: 12px;
    padding: 12px 18px;
    border-top: 1px solid ${colors.border};
  }
  .avatar {
    height: 0;
    grid-column: 1;
  }
  .postContent {
    grid-column: 2;
  }

  .header {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
  }
  .displayName {
    overflow: hidden;
    margin: 0 4px 0 0;
    /* TODO: bold? */
    font-weight: 700;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .headerContent {
    display: flex;
    flex-grow: 1;
  }
  .screenName {
    /* TODO: CaptionText*/
    color: ${colors.caption};
  }
  .headerRight {
    padding-left: 8px;
    margin-left: auto;
  }

  .footer {
    display: inline-flex;
    align-items: center;
    margin: 4px 0 0;
  }
`;
export type PostItemLayoutProps = Readonly<{
  authorAvatarContent: React.ReactNode;
  authorDisplayName: string;
  authorScreenName: string;
  headerRightContent: React.ReactNode;
  bodyContent: React.ReactNode;
}>;

export const PostItemLayout = ({
  authorAvatarContent,
  authorDisplayName,
  authorScreenName,
  headerRightContent,
  bodyContent,
}: PostItemLayoutProps) => (
  <div className="post">
    <style jsx>{postItemLayoutStyles}</style>
    <div className="avatar">{authorAvatarContent}</div>
    <div className="postContent">
      <div className="header">
        <span className="displayName">{authorDisplayName}</span>
        <div className="headerContent">
          <span className="screenName">@{authorScreenName}</span>
          <div className="headerRight">{headerRightContent}</div>
        </div>
      </div>
      {bodyContent}
    </div>
  </div>
);

// TODO: どこかに逃がす
const captionStyle = css`
  span {
    color: ${colors.caption};
  }
`;
export const CaptionText: React.FC = ({ children }) => (
  <span>
    <style jsx>{captionStyle}</style>
    {children}
  </span>
);
