import { LoginedAppContext } from '@/app/context';
import { createPager } from './logic';

export const getSeaTimelineInitialProps = (ctx: LoginedAppContext, query?: string) => {
  return {
    postsPager: createPager(ctx.api, query),
  };
};
