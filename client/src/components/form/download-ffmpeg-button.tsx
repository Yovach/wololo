import { memo, useCallback } from "react";
import { useFFmpeg } from "../../hooks/use-ffmpeg";

export const DownloadFFmpegButton = memo(function DownloadFFmpegButton() {
  const { download, isReady, isLoading } = useFFmpeg();
  const onClick = useCallback(() => download(), [download]);

  if (isReady) {
    return null;
  }

  if (isLoading) {
    return <span>Downloading..</span>;
  }

  return (
    <button type="button" onClick={onClick}>
      Download ffmpeg
    </button>
  );
});
