module.exports = {
  extends: ['eslint-config-airbnb', 'eslint-config-prettier'],
  rules: {
    'max-classes-per-file': 0,
    'no-else-return': 0,
    'no-console': 0,
    'one-var': [1, { initialized: 'never' }],
    'import/prefer-default-export': 1,
    'import/no-extraneous-dependencies': [
      2,
      { devDependencies: true, packageDir: __dirname },
    ],
    'import/order': [
      2,
      {
        groups: [['builtin', 'external']],
        'newlines-between': 'always',
      },
    ],
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.html.jsx'] }],
    'react/prefer-stateless-function': 0,
    'react/destructuring-assignment': 0,
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-curly-newline': 0,
    'jsx-a11y/anchor-is-valid': [2, { specialLink: ['to'] }],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  settings: {
    'import/resolver': 'webpack',
    'import/core-modules': ['path', 'stream'],
  },
};
