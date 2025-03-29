import { Suspense } from "react";
import { ConvertFileForm } from "./components/form/convert-file-form";
import { Banner } from "./components/header/banner";
import { Description } from "./components/header/description";
import { Logo } from "./components/header/logo";
import { getAvailableFormats } from "./helpers/api";
import { DownloadFFmpegButton } from "./components/form/download-ffmpeg-button";

function App() {
  return (
    <>
      <Logo />
      <Banner />
      <Description />
      <Suspense fallback={<span>Loading..</span>}>
        <ConvertFileForm availableFormatsPromise={getAvailableFormats()} />
      </Suspense>

      <Suspense>
        <DownloadFFmpegButton />
      </Suspense>
    </>
  );
}

export default App;
