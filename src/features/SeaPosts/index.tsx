import { useState, useCallback, useEffect, useContext, createContext } from 'react';
import { useSeaApi, SeaApi, useTrySeaApi } from '@/infra/sea';
import { Emitter, eventemit } from '@/utils/eventemit';
import { SeaPost } from '@/models/SeaPost';
import { SeaUser } from '@/models/SeaUser';

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
    [api, onError],
  );
  return {
    pending,
    postToSea,
  };
}

type ConnectionState = 'connecting' | 'connected';
type SeaPublicTimelineStreamState = Readonly<{
  connectionState: ConnectionState;
  postStream: Emitter<Readonly<{ post: SeaPost; author: SeaUser }>>;
  unreadCount: number;
}>;
const SeaPublicTimelineStreamStateContext = createContext<SeaPublicTimelineStreamState>({
  connectionState: 'connecting',
  postStream: eventemit<never>()[1],
  unreadCount: 0,
});
SeaPublicTimelineStreamStateContext.displayName = 'SeaPublicTimelineStreamStateContext';

export const SeaPublicTimelineStreamProvider: React.FC = ({ children }) => {
  const api = useTrySeaApi();
  const [emit, postStream] = useState(() => eventemit<Readonly<{ post: SeaPost; author: SeaUser }>>())[0];
  const [state, setState] = useState<ConnectionState>('connecting');
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    let retry = 0;
    let close: (() => void) | undefined;
    // バックグラウンドにあるかどうか
    let hidden = document.hidden;
    window.addEventListener('visibilitychange', () => {
      if (hidden !== document.hidden) {
        if (hidden) setUnreadCount(0);
      }
      hidden = document.hidden;
    });

    const connect = async () => {
      if (api == null) return;
      setState('connecting');
      while (true) {
        try {
          const conn = await api.connectPublicTimeline();
          setState('connected');
          const unsubMessage = conn.onMessage.subscribe((v) => {
            if (hidden || postStream.size === 0) setUnreadCount((u) => u + 1);
            emit(v);
          });
          const unsubClose = conn.onClose.subscribe(() => {
            unsubMessage();
            connect();
          });
          close = () => {
            unsubMessage();
            unsubClose();
            conn.close();
          };
          return;
        } catch (e) {
          console.error(e);
          await new Promise((r) => setTimeout(r, (250 + 500 * Math.random()) * 2 ** retry));
          retry++;
        }
      }
    };
    connect();
    return () => close?.();
  }, [api]);

  return (
    <SeaPublicTimelineStreamStateContext.Provider value={{ connectionState: state, postStream, unreadCount }}>
      {children}
    </SeaPublicTimelineStreamStateContext.Provider>
  );
};

export function usePublicTimelineStream() {
  return useContext(SeaPublicTimelineStreamStateContext);
}
