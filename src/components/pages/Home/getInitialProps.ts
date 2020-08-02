import { AppContext, isLogined } from '@/app/context';
import { getPublicTimelineInitialProps } from '@/components/Timeline/PublicTimeline/getInitialProps';

export const getHomeInitialProps = (ctx: AppContext) => {
  if (isLogined(ctx)) {
    return {
      ...getPublicTimelineInitialProps(ctx),
    };
  }
};
