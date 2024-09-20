// import globals from "globals";
// import pluginJs from "@eslint/js";

// // export default [
// //   { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
// //   pluginJs.configs.recommended,
// {
//   "rules": {
//     "space-before-paren": "off",
//     "semi": ["always", "error"]
//   }
// }

// // ];

// @ts-check

import eslint from "@eslint/js";
import globals from "globals";
// import jestPlugin from 'eslint-plugin-jest';
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // config with just ignores is the replacement for `.eslintignore`
    ignores: [
      "**/build/**",
      "**/dist/**",
      "src/some/file/to/ignore.ts",
      "**/coverage/**",
    ],
  },
  eslint.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      // jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // ...globals.jest,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      // "no-undef": "off",
    },
  },
  {
    // disable type-aware linting on JS files
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  // {
  // enable jest rules on test files
  // files: ['test/**'],
  // ...jestPlugin.configs['flat/recommended'],
  // },
);
