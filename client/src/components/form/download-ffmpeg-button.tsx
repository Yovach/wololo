"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { memo, useCallback, useRef } from "react";

import ffmpegWasm from "@ffmpeg/core/wasm?url";

export const DownloadFFmpegButton = memo(function DownloadFFmpegButton() {
  const ffmpegRef = useRef(new FFmpeg());

  const downloadFFmpeg = useCallback(async () => {
    await ffmpegRef.current.load({
      wasmURL: ffmpegWasm,
    });
  }, []);

  return (
    <button type="button" onClick={downloadFFmpeg}>
      Download ffmpeg
    </button>
  );
});
