import React from 'react';
import { NodeType } from '@linkage-community/bottlemail';
import * as pictograph from 'pictograph';
import { SeaPost } from '@/models/SeaPost';
import { filterThumbnailVariants, SeaFileVariant } from '@/models/SeaFile';
import {
  IconAvatar,
  TextAvatar,
  LinkText,
  BoldText,
  PostBodyTextWrapper,
  PostFooter,
  PostFooterBadge,
  PostItemLayout,
  CaptionText,
} from './presenters';
import { RelativeTime } from './RelativeTime';
import { SeaUser } from '@/models/SeaUser';

const SeaFileVariants: React.FC<{ readonly variants: readonly SeaFileVariant[] }> = ({ variants }) => (
  <>
    {variants.map((v) => (
      <source key={v.id} srcSet={v.url} type={v.mime} />
    ))}
  </>
);

const SeaPostBodyText: React.FC<{ readonly postBody: readonly NodeType[] }> = ({ postBody }) => {
  return (
    <PostBodyTextWrapper>
      {postBody.map((node, i) => {
        switch (node.kind) {
          case 'Link':
            return <LinkText key={i} href={node.value} />;
          case 'Mention':
            return <BoldText key={i}>{node.raw}</BoldText>;
          case 'EmojiName':
            return (
              <span key={i} title={node.raw}>
                {pictograph.dic[node.value] ?? node.raw}
              </span>
            );
          default:
            return <React.Fragment key={i}>{node.raw}</React.Fragment>;
        }
      })}
    </PostBodyTextWrapper>
  );
};

export type SeaPostItemProps = {
  readonly post: SeaPost;
  readonly author: SeaUser;
};

export const SeaPostItem = React.memo<SeaPostItemProps>(function SeaPostItem({ post, author }) {
  return (
    <PostItemLayout
      authorAvatarContent={
        author.avatarFile ? (
          <IconAvatar
            title={author.avatarFile.name}
            sources={<SeaFileVariants variants={filterThumbnailVariants(author.avatarFile)} />}
          />
        ) : (
          <TextAvatar name={author.name || author.screenName} />
        )
      }
      authorDisplayName={author.name}
      authorScreenName={author.screenName}
      headerRightContent={
        <CaptionText>
          <RelativeTime time={post.createdAt} />
        </CaptionText>
      }
      bodyContent={
        <>
          <SeaPostBodyText postBody={post.textNodes} />
          <PostFooter>
            via {post.via.name}
            {post.via.isBot && <PostFooterBadge>Bot</PostFooterBadge>}
          </PostFooter>
        </>
      }
    />
  );
});
