import { useState, useEffect } from 'react';
import { store, formatIDR } from './store.js';

/**
 * Custom React Hook that bridges `store.js` with React Components.
 * Automatically re-renders components whenever store state changes.
 */
export function useAssetStore() {
  const [stateSnapshot, setStateSnapshot] = useState(() => ({
    assets: [...store.assetsState],
    filteredAssets: store.getFilteredAssets(),
    logs: [...store.logsState],
    filters: { ...store.filterState }
  }));

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setStateSnapshot({
        assets: [...store.assetsState],
        filteredAssets: store.getFilteredAssets(),
        logs: [...store.logsState],
        filters: { ...store.filterState }
      });
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return {
    assets: stateSnapshot.assets,
    filteredAssets: stateSnapshot.filteredAssets,
    logs: stateSnapshot.logs,
    filters: stateSnapshot.filters,
    store,
    formatIDR
  };
}
