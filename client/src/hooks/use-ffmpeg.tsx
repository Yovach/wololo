import { FFmpeg } from "@ffmpeg/ffmpeg";
import { atom, useAtom } from "jotai";
import ffmpegWorker from "@ffmpeg/ffmpeg/worker?url";
import { useCallback, useEffect, useMemo } from "react";

const ffmpegAtom = atom(new FFmpeg());
const isLoadedAtom = atom(false);

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

export function useFFmpeg() {
  const [ffmpeg] = useAtom(ffmpegAtom);
  const [isLoaded, setIsLoaded] = useAtom(isLoadedAtom);

  const download = useCallback(async (): Promise<void> => {
    const ffmpegData = await importFFmpeg();
    await ffmpeg.load({
      wasmURL: ffmpegData.wasm.default,
      coreURL: ffmpegData.core.default,
      workerURL: ffmpegWorker,
    });

    setIsLoaded(true);

    localStorage.setItem(shouldAutomaticallyDownload, "1");
  }, [ffmpeg]);

  useEffect(() => {
    const value = localStorage.getItem(shouldAutomaticallyDownload);
    if (value === null) {
      return;
    }

    download();
  }, [download]);

  return useMemo(() => {
    return {
      ffmpeg,
      download,
      isLoaded,
    };
  }, [download, ffmpeg, isLoaded]);
}
