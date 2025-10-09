import { Activity, memo, NamedExoticComponent } from "react";
import { DownloadFFmpegButton } from "./download-ffmpeg-button";
import { useFFmpeg } from "../../contexts/ffmpeg-context";

export const DownloadFFmpegSection: NamedExoticComponent = memo(function DownloadFFmpegSection() {
  const { isReady } = useFFmpeg();

  return (
    <Activity mode={isReady ? "hidden" : "visible"}>
      <section className="download-ffmpeg-section">
        <DownloadFFmpegButton />
      </section>
    </Activity>
  );
});
