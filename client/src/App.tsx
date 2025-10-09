import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvertFileForm } from "./components/form/convert-file-form";
import { Description } from "./components/header/description";
import { Banner } from "./components/header/banner";
import { Logo } from "./components/header/logo";
import { DownloadFFmpegSection } from "./components/form/download-ffmpeg-section";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Logo />
      <Banner />
      <Description />
      <ConvertFileForm />

      <DownloadFFmpegSection />
    </QueryClientProvider>
  );
}

export default App;
