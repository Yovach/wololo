import { StrictMode } from "preact/compat";
import { render } from "preact";
import App from "./App.tsx";
import "modern-normalize/modern-normalize.css";
import "./css/style.css";

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("app")!,
);
