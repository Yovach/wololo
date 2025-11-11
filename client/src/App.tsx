import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JSX } from "react/jsx-runtime";
import { DownloadFFmpegSection } from "./components/form/download-ffmpeg-section";
import { UploadFileSection } from "./components/form/upload-file-section";
import { Logo } from "./components/header/logo";
import { FFmpegProvider } from "./contexts/ffmpeg-context";

const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <FFmpegProvider>
        <div>

        <Logo />
        </div>

          <UploadFileSection />

        <DownloadFFmpegSection />
      </FFmpegProvider>
    </QueryClientProvider>
  );
}

export default App;
