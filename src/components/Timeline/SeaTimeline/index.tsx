import React from 'react';
import { WindowVirtuoso } from '../WindowVirtuoso';
import { TimelineContainer, TimelineItem, TimelineFooterItem } from '../presenters';
import type { getSeaTimelineInitialProps } from './getInitialProps';
import { SeaPostItem } from '@/components/Post/SeaPostItem';
import { usePager } from './logic';
import { SeaPost } from '@/models/SeaPost';
import { SeaUser } from '@/models/SeaUser';

type TimelineProps = Readonly<{
  posts: readonly SeaPost[];
  users: Record<number, SeaUser>;
  loadingNext?: boolean;
  hasNext?: boolean;
  endReached: () => void;
}>;
const Timeline = ({ posts, users, loadingNext, hasNext, endReached }: TimelineProps) => (
  <WindowVirtuoso
    ListContainer={TimelineContainer}
    ItemContainer={TimelineItem}
    /* footerが高さ計算に使われない(なぜ?)ため行儀悪いがitemにfooterをいれる*/
    totalCount={posts.length + 1}
    defaultItemHeight={90}
    computeItemKey={(i) => (i === posts.length ? 'footer' : posts[i].id)}
    item={(i) => {
      if (i === posts.length) {
        return <>{loadingNext ? <TimelineFooterItem isLoading /> : !hasNext ? <TimelineFooterItem /> : null}</>;
      }
      return <SeaPostItem post={posts[i]} author={users[posts[i].author]} />;
    }}
    endReached={endReached}
  />
);

export const SeaTimeline = ({ postsPager }: ReturnType<typeof getSeaTimelineInitialProps>) => {
  const { posts, users, loadNext, loadingNext, hasNext } = usePager(postsPager);
  return (
    <Timeline posts={posts} users={users} endReached={() => loadNext(30)} loadingNext={loadingNext} hasNext={hasNext} />
  );
};
