import React, { Suspense } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { createSeaApi } from '@/infra/sea';
import { Home } from '../pages/Home';
import { CacheProvider } from '@/dataSource';
import { useCacheSet } from '@/dataSource/_cache';
import { AppStateProvider } from '@/appState';

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

export const App = () => {
  return (
    <>
      <ColorTheme mode="auto" />
      <GlobalStyles />
      <CacheProvider>
        <AppContainer>
          <Suspense fallback={null}>
            <Home />
          </Suspense>
        </AppContainer>
      </CacheProvider>
    </>
  );
};
