import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-console": "warn", // Change 'error' to 'warn' or 'off'
      "@typescript-eslint/no-unused-vars": "off", // Disable this rule
      "react-hooks/rules-of-hooks": "error", // Ensure React Hooks rules are enforced
      // Add or override other rules as needed
    },
  },
];

export default eslintConfig;