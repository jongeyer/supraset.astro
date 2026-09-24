import eslintPluginAstro from 'eslint-plugin-astro'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

const unusedVarsOptions = {
  argsIgnorePattern: '^_', // Ignore parameters starting with underscore
  varsIgnorePattern: '^_', // Ignore variables starting with underscore
}

export default [
  {
    ignores: ['dist/', '.astro/', '.netlify/'],
  },
  ...tsEslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  eslintConfigPrettier,
  {
    // add custom rules here
    rules: {
      semi: ['error', 'never'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', unusedVarsOptions],
      '@typescript-eslint/no-unused-vars': ['warn', unusedVarsOptions],
      'no-undef': 'warn',
    },
  },
  {
    // TypeScript checks these itself, with type-aware knowledge of globals
    files: ['**/*.ts', '**/*.astro', '**/*.astro/*.js', '**/*.astro/*.ts'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['netlify/**/*.js'],
    languageOptions: { globals: globals.node },
  },
]
