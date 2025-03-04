import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginPrettierRecommended from 'eslint-config-prettier'
import tsEslint from 'typescript-eslint'

export default [
  ...tsEslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    // add custom rules here
    rules: {
      semi: ['error', 'never'],
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'warn'
    }
  }
]
