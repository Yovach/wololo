import { FFmpeg } from "@ffmpeg/ffmpeg";
import { atom, useAtom } from "jotai";
import ffmpegCore from "@ffmpeg/core?url";
import ffmpegWasm from "@ffmpeg/core/wasm?url";
import ffmpegWorker from "@ffmpeg/ffmpeg/worker?url";
import { useCallback, useMemo } from "react";

const ffmpegAtom = atom(new FFmpeg());
const isLoadedAtom = atom(false);

export function useFFmpeg() {
  const [ffmpeg] = useAtom(ffmpegAtom);
  const [isLoaded, setIsLoaded] = useAtom(isLoadedAtom);

  const download = useCallback(async (): Promise<void> => {
    await ffmpeg.load({
      wasmURL: ffmpegWasm,
      coreURL: ffmpegCore,
      workerURL: ffmpegWorker,
    });

    setIsLoaded(true);
  }, [ffmpeg]);

  return useMemo(() => {
    return {
      ffmpeg,
      download,
      isLoaded,
    };
  }, [download, ffmpeg, isLoaded]);
}
