import { defineConfig } from "vite";
import preact from "@preact/preset-vite"

export default defineConfig({
  plugins: [preact()],
  build: {
    target: "ES2022"
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/core"],
  },
});
