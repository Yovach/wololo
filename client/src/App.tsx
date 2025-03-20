import { ConvertFileForm } from "./components/form/convert-file-form";
import { Banner } from "./components/header/banner";
import { Description } from "./components/header/description";
import { Logo } from "./components/header/logo";

function App() {
  return (
    <>
      <Logo />
      <Banner />
      <Description />
      <ConvertFileForm />
    </>
  );
}

export default App;
