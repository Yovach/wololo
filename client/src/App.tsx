import { Suspense } from "react";
import { ConvertFileForm } from "./components/form/convert-file-form";
import { Banner } from "./components/header/banner";
import { Description } from "./components/header/description";
import { Logo } from "./components/header/logo";
import { getAvailableFormats } from "./helpers/api";

function App() {
  return (
    <>
      <Logo />
      <Banner />
      <Description />
      <Suspense fallback={<span>Loading..</span>}>
        <ConvertFileForm availableFormatsPromise={getAvailableFormats()} />
      </Suspense>
    </>
  );
}

export default App;
