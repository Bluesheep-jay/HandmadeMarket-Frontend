import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills"; 
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      // sassVariables: "src/quasar-variables.sass",
    }),
  ],
  resolve: {
    alias: {
      buffer: "buffer",
      process: "process/browser",
      global: "global",
    },
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg"],
    esbuildOptions: {
      define: {
        global: "globalThis", 
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
          
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },

  server: {
    port: 3000,
  },
});
