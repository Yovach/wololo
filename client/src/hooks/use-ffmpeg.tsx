import { FFmpeg } from "@ffmpeg/ffmpeg";
import ffmpegWorker from "@ffmpeg/ffmpeg/worker?url";
import { useCallback, useState, useSyncExternalStore } from "react";

export const ffmpegInstance = new FFmpeg();

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

interface HookResult {
  isReady: boolean;
  isLoading: boolean;
  download: (signal?: AbortSignal) => Promise<void>;
}

function getSnapshot() {
  return localStorage.getItem(shouldAutomaticallyDownload) !== null;
}

function subscribe(callback: (evt: StorageEvent) => void) {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
}

async function downloadFFmpeg(signal?: AbortSignal) {
  const ffmpegData = await importFFmpeg();
  if (!ffmpegInstance.loaded) {
    await ffmpegInstance.load(
      {
        wasmURL: ffmpegData.wasm.default,
        coreURL: ffmpegData.core.default,
        workerURL: ffmpegWorker,
      },
      {
        signal,
      },
    );
    localStorage.setItem(shouldAutomaticallyDownload, "1");
  }
}

export function useFFmpeg(): HookResult {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isAutomaticallyDownloading = useSyncExternalStore(
    subscribe,
    getSnapshot,
  );

  const download = useCallback(async (signal: AbortSignal | undefined = undefined): Promise<void> => {
    setIsLoading(true);

    try {
      await downloadFFmpeg(signal);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReady(ffmpegInstance.loaded)
    }

    setIsLoading(false);
  }, []);

  if (isAutomaticallyDownloading && !isLoading && !isReady) {
    download();
  }

  return {
    download,
    isReady,
    isLoading,
  };
}
