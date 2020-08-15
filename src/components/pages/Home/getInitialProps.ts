import { AppContext, isLogined } from '@/app/context';
import { getSeaTimelineInitialProps } from '@/components/Timeline/SeaTimeline/getInitialProps';

export const getHomeInitialProps = (ctx: AppContext) => {
  if (isLogined(ctx)) {
    return {
      ...getSeaTimelineInitialProps(ctx),
    };
  }
};
