import { memo } from "react";
import { useFFmpeg } from "../../hooks/use-ffmpeg";

export const DownloadFFmpegButton = memo(function DownloadFFmpegButton() {
  const { download, isReady } = useFFmpeg();
  return isReady === false && (
    <button type="button" onClick={download}>
      Download ffmpeg
    </button>
  );
});
