import React, { createContext, useContext, useMemo } from 'react';
import { SeaApi, createSeaApi } from './api';

export const SeaApiContext = createContext<SeaApi | undefined>(undefined);
export const useSeaApi = () => {
  const api = useContext(SeaApiContext);
  if (api == null) {
    throw new Error('Sea API Clinent is not provided');
  }
  return api;
};

export const SeaApiProvider: React.FC = ({ children }) => {
  const baseUrl = process.env.API_ROOT!;
  const token = process.env.TOKEN!;
  const api = useMemo(() => createSeaApi(baseUrl, token), [baseUrl, token]);
  return <SeaApiContext.Provider value={api}>{children}</SeaApiContext.Provider>;
};
