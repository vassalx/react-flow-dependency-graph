import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2015", // ensure broad browser support
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "iife", // single self-executing bundle
        entryFileNames: "index.js",
        chunkFileNames: "index.js", // force one file
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.name &&
            assetInfo.name.indexOf(".css", assetInfo.name.length - 4) !== -1
          ) {
            return "index.css";
          }
          return assetInfo.name ?? "[name][extname]";
        },
      },
    },
  },
  base: "/react-flow-chart-poc/",
});
