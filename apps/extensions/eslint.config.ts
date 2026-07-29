import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [".output", ".wxt", "node_modules"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-refresh": reactRefresh,
      "unused-imports": unusedImports,
    },
    rules: {
      "react-refresh/only-export-components": [
        "off",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "warn",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  eslintConfigPrettier,
]);
