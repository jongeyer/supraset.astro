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
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',  // Ignore parameters starting with underscore
        varsIgnorePattern: '^_'   // Ignore variables starting with underscore
      }],
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',  // Ignore parameters starting with underscore
        varsIgnorePattern: '^_'   // Ignore variables starting with underscore
      }],
      'no-undef': 'warn'
    }
  }
]
