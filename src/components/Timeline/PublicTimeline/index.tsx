import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { TimelineContainer, TimelineItem } from '../presenters';
import type { getPublicTimelineInitialProps } from './getInitialProps';
import { SeaPostItem } from '@/components/Post/SeaPostItem';
import { usePager } from './logic';

// See: https://github.com/petyosi/react-virtuoso/issues/40
const WindowScrollContainer: NonNullable<React.ComponentProps<typeof Virtuoso>['ScrollContainer']> = ({
  className,
  style,
  reportScrollTop,
  scrollTo,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastOffsetTopRef = useRef(0);

  const reportScroll = useCallback(() => {
    reportScrollTop(Math.max(0, window.scrollY - (containerRef.current?.offsetTop ?? 0)));
  }, [reportScrollTop]);

  useEffect(() => {
    window.addEventListener('scroll', reportScroll);
    return () => window.removeEventListener('scroll', reportScroll);
  }, [reportScroll]);

  useEffect(() => {
    lastOffsetTopRef.current = containerRef.current?.offsetTop ?? 0;
    const handle = window.setInterval(() => {
      const offsetTop = containerRef.current?.offsetTop ?? 0;
      if (offsetTop !== lastOffsetTopRef.current) {
        lastOffsetTopRef.current = offsetTop;
        reportScroll();
      }
    }, 500);
    return () => window.clearInterval(handle);
  }, [containerRef.current]);

  useEffect(() => {
    scrollTo(({ top }) => {
      window.scrollTo(0, (top ?? 0) + lastOffsetTopRef.current);
    });
  }, [scrollTo]);

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        overflow: 'visible',
      }}
      className={className}
      tabIndex={0}
    >
      {React.Children.map(children, (child, index) => {
        if (index === 0) {
          const c: React.DetailedReactHTMLElement<any, HTMLElement> = child as any;
          return React.cloneElement(c, {
            style: {
              ...c.props.style,
              maxHeight: '100vh',
            },
          });
        }
        return child;
      })}
    </div>
  );
};

const WindowVirtuoso: React.ComponentType<React.ComponentProps<typeof Virtuoso>> = (props) => {
  const [totalHeight, setTotalHeight] = useState(0);
  const totalListHeightChanged = useCallback((h: number) => {
    setTotalHeight(h);
  }, []);
  return (
    <Virtuoso
      ScrollContainer={WindowScrollContainer}
      style={{
        height: totalHeight,
        // re-render hack
        minHeight: Math.max(1, totalHeight),
        ...props.style,
      }}
      totalListHeightChanged={totalListHeightChanged}
      {...props}
    />
  );
};

export const PublicTimeline = ({ postsPager }: ReturnType<typeof getPublicTimelineInitialProps>) => {
  const { posts, users, loadNext } = usePager(postsPager);
  return (
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
        endReached={() => loadNext(30)}
      />
    </TimelineContainer>
  );
};
