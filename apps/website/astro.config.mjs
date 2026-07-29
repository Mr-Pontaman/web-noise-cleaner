import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { GITHUB_REPO } from "./src/constants.ts";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  // import.meta.env.SITE で以下が出る
  site: "https://mr-pontaman.github.io",
  // import.meta.env.BASE_URL で以下が出る
  base: GITHUB_REPO,
  outDir: "dist",
  build: {
    assets: "assets",
  },
});
