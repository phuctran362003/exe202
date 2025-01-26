import { createContext, useContext } from 'react';

export const DataRefreshContext = createContext<() => void>(() => {});

export const useDataRefresh = () => useContext(DataRefreshContext);
