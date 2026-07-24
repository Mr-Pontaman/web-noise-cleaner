import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { GITHUB_REPO } from "./constants";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  // GitHub Pages のベースURL
  site: { GITHUB_REPO },
  base: "/web-noise-cleaner",
  outDir: "dist",
  build: {
    assets: "assets",
  },
});
