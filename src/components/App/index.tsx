import React, { Suspense, useState, Children } from 'react';
import { ColorTheme, GlobalStyles } from '@/theme';
import { SeaApiProvider, useSeaApi, createSeaApi } from '@/infra/sea';
import { Home } from '../pages/Home';
import { CacheProvider, createSeaDataSource } from '@/dataSource';
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
        <SeaApiProvider>
          <AppContainer>
            <Suspense fallback={null}>
              <Home />
            </Suspense>
          </AppContainer>
        </SeaApiProvider>
      </CacheProvider>
    </>
  );
};
