import { defineConfig } from "vite";
import pluginReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    pluginReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  build: {
    target: "ES2022",
    minify: false,
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/core"],
  },
});
