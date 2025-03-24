"use client";

import { memo } from "react";
import { useFFmpeg } from "../../hooks/use-ffmpeg";

export const DownloadFFmpegButton = memo(function DownloadFFmpegButton() {
  const { download, isLoaded } = useFFmpeg();
  return isLoaded === false && (
    <button type="button" onClick={download}>
      Download ffmpeg
    </button>
  );
});
