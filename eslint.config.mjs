import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import jseslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const project = "./tsconfig.json";
const compat = new FlatCompat({
  recommendedConfig: jseslint.configs.recommended,
});

function legacyPlugin(name, alias = name) {
  const plugin = compat.plugins(name)[0]?.plugins?.[alias];
  if (!plugin) {
    throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
  }
  return fixupPluginRules(plugin);
}

export default tseslint.config(
  {
    ignores: ['node_modules', 'dist', 'build'],
    extends: [
      jseslint.configs.recommended,
      ...tseslint.configs.recommended,
      eslintPluginPrettierRecommended,
      ...compat.extends("plugin:import/typescript"),
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      import: legacyPlugin("eslint-plugin-import", "import"),
    },
    settings: {
      'import/resolver': {
        typescript: {
          project,
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "semi": ["error", "always"],
      "import/order": ["error",{
        "groups": [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index",
          "object",
          "type",
          "unknown"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
    },
  },
);
