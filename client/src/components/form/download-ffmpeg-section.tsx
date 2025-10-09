import { Activity, memo } from "react";
import { DownloadFFmpegButton } from "./download-ffmpeg-button";
import { useFFmpeg } from "../../contexts/ffmpeg-context";

export const DownloadFFmpegSection = memo(function DownloadFFmpegSection() {
  const { isReady } = useFFmpeg();

  console.log(isReady);

  return (
    <Activity mode={isReady ? "hidden" : "visible"}>
      <section className="download-ffmpeg-section">
        <DownloadFFmpegButton />
      </section>
    </Activity>
  );
});
