import { FFmpeg } from "@ffmpeg/ffmpeg";
import { atom, useAtom } from "jotai";
import ffmpegWorker from "@ffmpeg/ffmpeg/worker?url";
import { useCallback, useEffect } from "preact/hooks";
import { useSyncExternalStore } from "react-dom";

export const ffmpegInstance = new FFmpeg();

// This atom changes when FFmpeg has been loaded with core
const isReadyAtom = atom(false);

// This atom changes when FFmpeg is importing
const isLoadingAtom = atom(false);

const shouldAutomaticallyDownload = "auto-download-ffmpeg";

async function importFFmpeg() {
  // If we can use SharedArrayBuffer, use ffmpeg multi-thread
  if ("SharedArrayBuffer" in window) {
    return {
      core: await import("@ffmpeg/core-mt?url"),
      wasm: await import("@ffmpeg/core-mt/wasm?url"),
    };
  }

  // Otherwise, use ffmpeg single-thread
  return {
    core: await import("@ffmpeg/core?url"),
    wasm: await import("@ffmpeg/core/wasm?url"),
  };
}

type HookResult = {
  isReady: boolean;
  isLoading: boolean;
  download: () => Promise<void>;
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

export function useFFmpeg(): HookResult {
  const [isReady, setIsReady] = useAtom(isReadyAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const isDownloading = useSyncExternalStore(subscribe, getSnapshot);

  const download = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const ffmpegData = await importFFmpeg();

    if (!ffmpegInstance.loaded) {
      await ffmpegInstance.load({
        wasmURL: ffmpegData.wasm.default,
        coreURL: ffmpegData.core.default,
        workerURL: ffmpegWorker,
      });
      localStorage.setItem(shouldAutomaticallyDownload, "1");
    }

    setIsReady(true);
    setIsLoading(false);
  }, [setIsLoading, setIsReady]);

  useEffect(() => {
    if (!isDownloading) {
      return;
    }

    download();
  }, [download, isDownloading]);

  return {
    download,
    isReady,
    isLoading,
  };
}
