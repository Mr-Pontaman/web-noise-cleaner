import { MATCH_URLS } from "./src/constants";
import { metadata } from "./src/lib/metadata";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";
import pkg from "./package.json";

const { appName, description } = metadata;

export default defineConfig({
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  zip: {
    artifactTemplate: "web-noise-cleaner-{{browser}}-v{{version}}.zip",
  },
  manifest: {
    name: appName,
    version: pkg.version,
    description: description,
    permissions: ["storage", "declarativeNetRequest"],
    host_permissions: MATCH_URLS.map((item) => item.url),
    icons: {
      "16": "icon/icon.png",
      "48": "icon/icon.png",
      "128": "icon/icon.png",
    },
    action: {
      default_icon: "icon/icon.png",
    },
  },
});
