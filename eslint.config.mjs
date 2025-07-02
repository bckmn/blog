import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**/*", "node_modules/**/*"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
    },
    rules: {
      "comma-style": "error",
      "comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "always-multiline",
        },
      ],
      "eol-last": ["error", "always"],
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc" },
          groups: ["builtin", "external", "parent", "sibling"],
          "newlines-between": "always",
        },
      ],
      indent: ["error", 2, { SwitchCase: 1 }],
      "key-spacing": ["error", { mode: "minimum" }],
      "keyword-spacing": "error",
      "no-constant-condition": "error",
      "prefer-const": "error",
      quotes: [
        "error",
        "double",
        { allowTemplateLiterals: true, avoidEscape: true },
      ],
      semi: "error",
      "semi-spacing": "error",
      "spaced-comment": "error",
    },
  },
];

export default eslintConfig;
