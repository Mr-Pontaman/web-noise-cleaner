import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://mr-pontaman.github.io",
  base: "/web-noise-cleaner",
  outDir: "dist",
  build: {
    assets: "assets",
  },
});
