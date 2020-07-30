import React, { Suspense } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { createSeaApi } from '@/infra/sea';
import { Home, getInitialProps } from '../pages/Home';
import { CacheProvider } from '@/dataSource';
import { useCacheSet } from '@/dataSource/_cache';
import { AppStateProvider, useAppState } from '@/appState';
import { memoize } from '@/utils/memoize';

const AppContainer: React.FC = ({ children }) => {
  // TODO: Create API directly
  const api = createSeaApi(process.env.API_ROOT!, process.env.TOKEN!);
  const setCache = useCacheSet();
  return (
    <AppStateProvider api={api} setCache={setCache}>
      {children}
    </AppStateProvider>
  );
};

// TODO: ちゃんと実装する
const memoizedGetInitialProps = memoize(getInitialProps);
const Router = () => {
  const appState = useAppState();
  const initialProps = memoizedGetInitialProps(appState);
  return (
    <Suspense fallback={null}>
      <Home {...initialProps} />
    </Suspense>
  );
};

export const App = () => {
  return (
    <>
      <ColorTheme mode="auto" />
      <GlobalStyles />
      <CacheProvider>
        <AppContainer>
          <Router />
        </AppContainer>
      </CacheProvider>
    </>
  );
};
