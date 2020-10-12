import { colors } from '@/theme';
import css from 'styled-jsx/css';
import { CallbackRef } from 'react-virtuoso/dist/Utils';
import { VirtuosoProps } from 'react-virtuoso';

type TimelineContainerProps = React.PropsWithChildren<{ listRef?: CallbackRef; style?: React.CSSProperties }>;
export const TimelineContainer = ({ listRef, style, children }: TimelineContainerProps) => (
  <ul ref={listRef} style={style} className="timeline">
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

type ItemContainerProps = React.ComponentProps<NonNullable<VirtuosoProps['ItemContainer']>>;
type FooterContainerProps = React.ComponentProps<NonNullable<VirtuosoProps['FooterContainer']>>;
export const TimelineItem = ({ children, ...rest }: Partial<ItemContainerProps> & Partial<FooterContainerProps>) => (
  <li {...rest}>{children}</li>
);

const timelineFooterItemStyle = css`
  .timeline-footer {
    width: 100%;
    padding: 12px 24px;
    margin-bottom: 40px;
    text-align: center;
    border-top: 1px solid ${colors.border};
  }
`;
export const TimelineFooterItem: React.FC<{ isLoading?: boolean }> = ({ isLoading }) => (
  <div className="timeline-footer">
    <style jsx>{timelineFooterItemStyle}</style>
    {isLoading ? 'LOADING...' : 'END REACHED'}
  </div>
);
