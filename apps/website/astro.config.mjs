import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  // import.meta.env.SITE で以下が出る
  site: "https://mr-pontaman.github.io",
  // import.meta.env.BASE_URL で以下が出る
  base: "/web-noise-cleaner",
  outDir: "dist",
  build: {
    assets: "assets",
  },
});
