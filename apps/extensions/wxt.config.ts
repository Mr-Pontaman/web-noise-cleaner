import { metadata } from "./src/lib/metadata";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

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
    version: "0.1.0",
    description: description,
    permissions: ["storage", "declarativeNetRequest"],
    host_permissions: [
      "*://*.x.com/*",
      "*://*.twitter.com/*",
      "*://*.youtube.com/*",
      "*://*.google.com/*",
      "*://*.yahoo.co.jp/*",
    ],
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
