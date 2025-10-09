import { defineConfig } from "vite";
import pluginReact from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [pluginReact()],
  build: {
    target: "ES2022"
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/core"],
  },
});
