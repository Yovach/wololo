import {
    Context,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { downloadFFmpeg, ffmpegInstance } from "../helpers/ffmpeg";
import { shouldAutomaticallyDownload } from "../helpers/constants";
import { JSX } from "react/jsx-runtime";

interface FFmpegContext {
  isReady: boolean;
  setIsReady: Dispatch<SetStateAction<boolean>>;

  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;

  download: (signal?: AbortSignal | undefined) => Promise<void>;
}

const initialValues: FFmpegContext = {
  isReady: false,
  setIsReady() {},

  isLoading: false,
  setIsLoading() {},

  async download() {},
};

function getSnapshot() {
  return localStorage.getItem(shouldAutomaticallyDownload) !== null;
}

function subscribe(callback: (evt: StorageEvent) => void) {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
}

const FFmpegContext: Context<FFmpegContext> = createContext(initialValues);

export function useFFmpeg(): FFmpegContext {
  const ffmpeg = useContext(FFmpegContext);
  if (!ffmpeg) {
    throw new Error("Expected a FFmpeg context");
  }

  return ffmpeg;
}

export function FFmpegProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isAutomaticallyDownloading = useSyncExternalStore(
    subscribe,
    getSnapshot,
  );

  const download = useCallback(
    async (signal: AbortSignal | undefined = undefined): Promise<void> => {
      setIsLoading(true);

      try {
        await downloadFFmpeg(signal);
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(ffmpegInstance.loaded);
      }

      setIsLoading(false);
    },
    [setIsLoading, setIsReady],
  );

  if (isAutomaticallyDownloading && !isLoading && !isReady) {
    download();
  }

  const value = useMemo<FFmpegContext>(
    () => ({ isLoading, isReady, setIsLoading, setIsReady, download }),
    [download, isLoading, isReady],
  );

  return (
    <FFmpegContext.Provider value={value}>{children}</FFmpegContext.Provider>
  );
}
