module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/recommended'],
  globals: {
    __static: true
  },
  plugins: ['vue'],
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 0,
    'no-unused-vars': ['error', { args: 'none' }],
    'vue/max-attributes-per-line': 0,
    'vue/name-property-casing': 0
  }
}
