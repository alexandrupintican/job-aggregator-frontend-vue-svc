import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve as resolvePath } from "node:path";
import convertScssToCss from "./src/vite/devSingleCss";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const currentEnv = loadEnv(mode, resolvePath(__dirname), ["VITE_"]);
  process.env = { ...process.env, ...currentEnv };
  return {
    plugins: [
      vue(),
      convertScssToCss(),
      svgLoader(),
      // additional vite plugins
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // scss files to use across the project
        },
      },
    },
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": resolvePath(__dirname, "src"),
        "@globalStyle": resolvePath(__dirname, "src/assets/style"),
      },
    },
    build: {
      cssCodeSplit: false,
      sourcemap: "hidden",
      rolldownOptions: {
        output: {
          hashCharacters: "base36",
        },
      },
    },
  };
});
