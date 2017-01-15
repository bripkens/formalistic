module.exports = {
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ]
  }
};
