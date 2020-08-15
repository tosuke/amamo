import { AppContext, isLogined } from '@/app/context';
import { createPager } from '@/components/Timeline/SeaTimeline/logic';

export const getSearchInitialProps = (ctx: AppContext) => {
  if (isLogined(ctx)) {
    const params = new URLSearchParams(ctx.history.location.search);
    const query = params.get('q');
    return {
      initialQuery: query ?? '',
      initialPager: query ? createPager(ctx.api, query) : undefined,
    };
  }
};
