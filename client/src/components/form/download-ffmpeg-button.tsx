import { memo, useCallback } from "react";
import { useFFmpeg } from "../../hooks/use-ffmpeg";

export const DownloadFFmpegButton = memo(function DownloadFFmpegButton() {
  const { download, isLoading } = useFFmpeg();
  const onClick = useCallback(() => download(), [download]);

  return (
    <button type="button" onClick={onClick} disabled={isLoading}>
      {
        isLoading ? "Downloading.." : "Download ffmpeg"
      }
    </button>
  );
});
