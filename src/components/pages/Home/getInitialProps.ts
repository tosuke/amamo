import { AppContext } from '@/app/context';
import { getPublicTimelineInitialProps } from '@/components/Timeline/PublicTimeline/getInitialProps';
import { getIsLogin } from '@/features/SeaAuth';

export const getHomeInitialProps = (ctx: AppContext) => {
  if (getIsLogin(ctx.store)) {
    return {
      ...getPublicTimelineInitialProps(ctx),
    };
  }
};
