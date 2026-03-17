const nextPlugin = require("@next/eslint-plugin-next");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  {
    ignores: ["**/node_modules/**", "**/.next/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];
