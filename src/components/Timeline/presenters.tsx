import React from 'react';
import { colors } from '@/theme';

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

export const ReadMoreButton: React.FC<{ isLoading: boolean; readMore: () => void }> = ({ isLoading, readMore }) => (
  <button
    className="readmore_button"
    disabled={isLoading}
    onClick={(e) => {
      e.preventDefault();
      readMore();
    }}
  >
    {isLoading ? 'LOADING...' : 'READ MORE'}
    <style jsx>{`
      .readmore_button {
        width: 100%;
        padding: 12px 24px;
        border-top: 1px solid ${colors.border};
      }
    `}</style>
  </button>
);
