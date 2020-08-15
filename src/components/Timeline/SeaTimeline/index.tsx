import React from 'react';
import { WindowVirtuoso } from '../WindowVirtuoso';
import { TimelineContainer, TimelineItem } from '../presenters';
import type { getSeaTimelineInitialProps } from './getInitialProps';
import { SeaPostItem } from '@/components/Post/SeaPostItem';
import { usePager } from './logic';
import { SeaPost } from '@/models/SeaPost';
import { SeaUser } from '@/models/SeaUser';

type TimelineProps = Readonly<{
  posts: readonly SeaPost[];
  users: Record<number, SeaUser>;
  endReached: () => void;
}>;
const Timeline = ({ posts, users, endReached }: TimelineProps) => (
  <TimelineContainer>
    <WindowVirtuoso
      totalCount={posts.length}
      defaultItemHeight={90}
      computeItemKey={(i) => posts[i].id}
      item={(i) => (
        <TimelineItem>
          <SeaPostItem post={posts[i]} author={users[posts[i].author]} />
        </TimelineItem>
      )}
      endReached={endReached}
    />
  </TimelineContainer>
);

export const SeaTimeline = ({ postsPager }: ReturnType<typeof getSeaTimelineInitialProps>) => {
  const { posts, users, loadNext } = usePager(postsPager);
  return <Timeline posts={posts} users={users} endReached={() => loadNext(30)} />;
};
