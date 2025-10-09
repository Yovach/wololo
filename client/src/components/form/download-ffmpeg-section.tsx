import { Activity, memo } from "react";
import { useFFmpeg } from "../../hooks/use-ffmpeg";
import { DownloadFFmpegButton } from "./download-ffmpeg-button";

export const DownloadFFmpegSection = memo(function DownloadFFmpegSection() {
  const { isReady } = useFFmpeg();

  return (
    <Activity mode={isReady ? "hidden" : "visible"}>
      <section className="download-ffmpeg-section">
        <DownloadFFmpegButton />
      </section>
    </Activity>
  );
});
