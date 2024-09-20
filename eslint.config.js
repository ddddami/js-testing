import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  {
    rules: {
      // I think both are by default.
      // "space-before-function-paren": "error"
      // "semi": ["error", "always"],
    },
  },
];
