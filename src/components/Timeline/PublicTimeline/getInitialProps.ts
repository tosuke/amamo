import { LoginedAppContext } from '@/app/context';
import { createPager } from './logic';

export const getPublicTimelineInitialProps = (ctx: LoginedAppContext) => {
  return {
    postsPager: createPager(ctx),
  };
};
