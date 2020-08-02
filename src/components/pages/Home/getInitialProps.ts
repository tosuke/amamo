import { AppContext } from '@/app/context';
import { getPublicTimelineInitialProps } from '@/components/Timeline/PublicTimeline/getInitialProps';

export const getHomeInitialProps = (appContext: AppContext) => {
  return {
    ...getPublicTimelineInitialProps(appContext),
  };
};
