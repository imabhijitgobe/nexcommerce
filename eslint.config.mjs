// ESLint flat config (v9+). See todos P2-017. Run: pnpm lint
export default [
  {
    ignores: ["node_modules/", "dist/", "coverage/", "client/"]
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs"
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error"
    }
  }
];
