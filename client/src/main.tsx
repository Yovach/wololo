import { StrictMode } from "react";
import App from "./App.tsx";
import "./css/style.css";
import { createRoot } from "react-dom/client";

const appEl = document.getElementById("app");
if (!appEl) {
  throw new Error("Missing root");
}

const rootEl = createRoot(appEl);
rootEl.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
