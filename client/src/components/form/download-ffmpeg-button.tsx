import { memo, NamedExoticComponent, useCallback } from "react";
import { useFFmpeg } from "../../contexts/ffmpeg-context";

export const DownloadFFmpegButton: NamedExoticComponent = memo(
  function DownloadFFmpegButton() {
    const { download, isLoading } = useFFmpeg();
    const onClick = useCallback(() => download(), [download]);

    return (
      <button type="button" onClick={onClick} disabled={isLoading}>
        {isLoading ? "Downloading.." : "Download ffmpeg"}
      </button>
    );
  },
);
