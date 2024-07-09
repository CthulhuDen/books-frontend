/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')
require('@intlify/eslint-plugin-vue-i18n')

module.exports = {
  env: {
    node: true,
  },
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:@intlify/vue-i18n/recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // Optional.
    '@intlify/vue-i18n/no-dynamic-keys': 'error',
    '@intlify/vue-i18n/no-unused-keys': [
      'error',
      {
        extensions: ['.js', '.ts', '.vue']
      }
    ]
  },
  settings: {
    'vue-i18n': {
      localeDir: './src/locales/*.{json,json5,yaml,yml}', // extension is glob formatting!
      messageSyntaxVersion: '^9.0.0'
    }
  }
}
