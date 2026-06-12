import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // .claude/ holds agent workflow scripts (not app code); audits/ and
  // playwright-report/ are generated artifacts.
  { ignores: ["dist", ".claude", "audits", "playwright-report", "test-results"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // Matches the project's deliberate loose-TS posture (strict: false).
      // Kept visible as a warning rather than an error so `npm run lint`
      // is a binary signal again — it sat permanently red with 79 errors,
      // making new real errors invisible.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
