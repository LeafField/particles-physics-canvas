import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  root: "./src",
  build: {
    outDir: "../docs",
    rollupOptions: {
      output: {
        entryFileNames: "main.js",
        chunkFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.css$/.test(assetInfo.name)) {
            return "style.css";
          }
          return "[name].[ext]";
        },
      },
    },
  },
});
