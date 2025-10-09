import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvertFileForm } from "./components/form/convert-file-form";
import { Description } from "./components/header/description";
import { Banner } from "./components/header/banner";
import { Logo } from "./components/header/logo";
import { DownloadFFmpegSection } from "./components/form/download-ffmpeg-section";
import { FFmpegProvider } from "./contexts/ffmpeg-context";
import { JSX } from "react/jsx-runtime";

const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <FFmpegProvider>
        <Logo />
        <Banner />
        <Description />
        <ConvertFileForm />

        <DownloadFFmpegSection />
      </FFmpegProvider>
    </QueryClientProvider>
  );
}

export default App;
