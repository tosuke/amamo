import React, { useState, unstable_useTransition as useTransition, Suspense, useMemo, useEffect } from 'react';
import { debounce } from 'lodash-es';
import type { getSearchInitialProps } from './getInitialProps';
import { RedirectToLogin } from '../_commons/RedirectToLogin';
import { SeaTimeline } from '@/components/Timeline/SeaTimeline';
import { SearchForm } from '@/components/SearchForm';
import { useSeaApi } from '@/infra/sea';
import { createPager } from '@/components/Timeline/SeaTimeline/logic';
import { useHistory } from '@/middlewares/router';
import css from 'styled-jsx/css';

const searchPlaceholderStyles = css`
  .placeholder {
    width: 100%;
    padding: 12px 24px;
    text-align: center;
  }
`;
const SearchPlaceholder: React.FC = ({ children }) => (
  <div className="placeholder">
    <style jsx>{searchPlaceholderStyles}</style>
    {children}
  </div>
);

const SUSPENSE_CONFIG: React.TimeoutConfig = { timeoutMs: 1500 };
const SearchContent: React.FC<NonNullable<ReturnType<typeof getSearchInitialProps>>> = ({
  initialPager,
  initialQuery,
}) => {
  const api = useSeaApi();
  const history = useHistory();
  const [startTransition, pending] = useTransition(SUSPENSE_CONFIG);
  const [query, setQuery] = useState(initialQuery);
  const [pager, setPager] = useState(initialPager);
  const handleQueryChange = useMemo(() => {
    const updatePager = debounce((newQuery: string) => {
      const newPager = newQuery ? createPager(api, newQuery) : undefined;
      startTransition(() => setPager(newPager));
    }, 500);
    return (newQuery: string) => {
      history.replace({
        search: newQuery ? `?q=${encodeURIComponent(newQuery)}` : '',
      });
      setQuery(newQuery);
      updatePager(newQuery);
    };
  }, [api, startTransition]);

  useEffect(
    () =>
      history.listen(({ action, location: { search, pathname } }) => {
        if (pathname !== '/search') {
          return;
        }
        const query = new URLSearchParams(search).get('q') ?? '';
        if (action === 'POP') {
          handleQueryChange(query);
        }
      }),
    [history, handleQueryChange]
  );

  // Workaround for https://github.com/ReactTraining/history/issues/814
  useEffect(
    () => () => {
      history.replace({
        search: '',
      });
    },
    []
  );

  return (
    <>
      <SearchForm value={query} onChange={handleQueryChange} pending={pending} />
      <Suspense fallback={<SearchPlaceholder>loading...</SearchPlaceholder>}>
        {pager != null ? <SeaTimeline postsPager={pager} /> : <SearchPlaceholder>クエリを入力してね</SearchPlaceholder>}
      </Suspense>
    </>
  );
};
const Search = ({ prepared }: { prepared: ReturnType<typeof getSearchInitialProps> }) => {
  if (prepared == null) return <RedirectToLogin />;
  prepared.initialPager?.initialData.read();
  return <SearchContent {...prepared} />;
};
export default Search;
