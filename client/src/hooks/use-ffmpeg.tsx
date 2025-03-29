import { FFmpeg } from "@ffmpeg/ffmpeg";
import { atom, useAtom } from "jotai";
import ffmpegWorker from "@ffmpeg/ffmpeg/worker?url";
import { useCallback, useEffect } from "react";

const ffmpegAtom = atom(new FFmpeg());

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
  ffmpeg: FFmpeg;
  download: () => Promise<void>;
};

export function useFFmpeg(): HookResult {
  const [ffmpeg] = useAtom(ffmpegAtom);
  const [isReady, setIsReady] = useAtom(isReadyAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  const download = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    const ffmpegData = await importFFmpeg();
    await ffmpeg.load({
      wasmURL: ffmpegData.wasm.default,
      coreURL: ffmpegData.core.default,
      workerURL: ffmpegWorker,
    });
    localStorage.setItem(shouldAutomaticallyDownload, "1");

    setIsReady(true);
    setIsLoading(false);
  }, [ffmpeg, setIsLoading, setIsReady]);

  useEffect(() => {
    const value = localStorage.getItem(shouldAutomaticallyDownload);
    if (value === null) {
      return;
    }

    download();
  }, [download]);

  return {
    ffmpeg,
    download,
    isReady,
    isLoading,
  };
}
