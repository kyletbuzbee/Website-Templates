module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    serviceworker: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    '__IS_PRODUCTION__': 'readonly',
    '__IS_DEVELOPMENT__': 'readonly',
    'ABTestingManager': 'readonly',
    'ABTestingUI': 'readonly',
    'CustomizationManager': 'readonly',
    'CustomizationUI': 'readonly',
    'authManager': 'readonly'
  },
  rules: {
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-prototype-builtins': 'error',
    'no-dupe-else-if': 'error',
    'no-undef': 'error'
  },
  ignorePatterns: [
    'dist/',
    'build/',
    'node_modules/',
    '.vite/',
    'coverage/'
  ]
};
