import React from 'react';
import { colors } from '@/theme';
import css from 'styled-jsx/css';

export const TimelineContainer: React.FC = ({ children }) => (
  <ul className="timeline">
    {children}
    <style jsx>{`
      .timeline {
        margin: 0;
        padding: 0;
        list-style: none;
      }
    `}</style>
  </ul>
);

export const TimelineItem: React.FC = ({ children }) => <li>{children}</li>;

const timelineFooterItemStyle = css`
  .timeline-footer {
    width: 100%;
    padding: 12px 24px;
    border-top: 1px solid ${colors.border};
  }
`;
export const TimelineFooterItem: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <TimelineItem>
    <style jsx>{timelineFooterItemStyle}</style>
    <div>{isLoading ? 'LOADING...' : 'END REACHED'}</div>
  </TimelineItem>
);
