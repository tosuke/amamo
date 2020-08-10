import { useState, useCallback } from 'react';
import { useSeaApi, SeaApi } from '@/infra/sea';

export function usePostToSea(onError?: (err: unknown) => void) {
  const api = useSeaApi();
  const [pending, setPending] = useState(false);
  const postToSea = useCallback(
    async (...params: Parameters<SeaApi['post']>) => {
      try {
        setPending(true);
        await api.post(...params);
      } catch (e) {
        onError?.(e);
      } finally {
        setPending(false);
      }
    },
    [api, onError]
  );
  return {
    pending,
    postToSea,
  };
}
