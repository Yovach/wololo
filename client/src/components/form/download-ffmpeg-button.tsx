"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { memo, useCallback, useRef, useState } from "react";

import ffmpegCore from "@ffmpeg/core?url";
import ffmpegWasm from "@ffmpeg/core/wasm?url";
import ffmpegWorker from "@ffmpeg/ffmpeg/worker?url";

export const DownloadFFmpegButton = memo(function DownloadFFmpegButton() {
  const ffmpegRef = useRef(new FFmpeg());
  const [isLoaded, setIsLoaded] = useState(false);

  const downloadFFmpeg = useCallback(async () => {
    await ffmpegRef.current.load({
      wasmURL: ffmpegWasm,
      coreURL: ffmpegCore,
      workerURL: ffmpegWorker,
    });
    setIsLoaded(true);
  }, []);

  return isLoaded === true ? (
    <button type="button" onClick={downloadFFmpeg}>
     convert
    </button>
  ) : (
    <button type="button" onClick={downloadFFmpeg}>
    Download ffmpeg
  </button>
  );
});
