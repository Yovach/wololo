import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvertFileForm } from "./components/form/convert-file-form";
import { DownloadFFmpegButton } from "./components/form/download-ffmpeg-button";
import { Fragment } from "react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Fragment>
        {/* <Logo />
      <Banner />
      <Description /> */}
        <ConvertFileForm />

        <DownloadFFmpegButton />
      </Fragment>
    </QueryClientProvider>
  );
}

export default App;
