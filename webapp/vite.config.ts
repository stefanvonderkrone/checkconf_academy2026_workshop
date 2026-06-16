import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: true,
    minify: mode === "production",
    manifest: true,
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  server: {
    hmr: process.env.DOCKER
      ? { port: 4322, clientPort: 443, host: "0.0.0.0", protocol: "wss" }
      : undefined,
    allowedHosts: ["web.app"],
  },
}));
