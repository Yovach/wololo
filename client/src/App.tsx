import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JSX } from "react/jsx-runtime";
import { UploadFileSection } from "./components/form/upload-file-section";

const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
        <div>

        {/* <Logo /> */}
        </div>

          <UploadFileSection />

    </QueryClientProvider>
  );
}

export default App;
