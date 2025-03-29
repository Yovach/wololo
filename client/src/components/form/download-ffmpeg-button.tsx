import { memo } from "react";
import { useFFmpeg } from "../../hooks/use-ffmpeg";

export const DownloadFFmpegButton = memo(function DownloadFFmpegButton() {
  const { download, isReady, isLoading } = useFFmpeg();

  if (isReady) {
    return null;
  }

  if (isLoading) {
    return (
      <span>Downloading..</span>
    );
  }

  return (
    <button type="button" onClick={download}>
      Download ffmpeg
    </button>
  );
});
