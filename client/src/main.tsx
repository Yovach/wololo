import { initLogger } from "evlog";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./css/style.css";

// Initialize evlog for client-side
initLogger({
  env: {
    service: "wololo-client",
    environment: import.meta.env.MODE || "development",
  },
});

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
