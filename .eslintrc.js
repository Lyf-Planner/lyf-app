'use strict';

const importRules = {
  'import/default': 'off',
  'import/namespace': 'off',
  'import/no-named-as-default': 'off',
  'import/order': [
    'error',
    {
      alphabetize: {
        order: 'asc',
        caseInsensitive: false
      },
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      pathGroups: [
        {
          pattern: '{react,react-native,react-dom,react-router,react-router-dom}',
          group: 'builtin'
        },
        {
          pattern: 'react-dom/**',
          group: 'builtin'
        }
      ],
      pathGroupsExcludedImportTypes: []
    }
  ],
  'import/no-relative-parent-imports': 'error'
};

const reactRules = {
  'react/display-name': 'off',
  'react/react-in-jsx-scope': 'off',
  'react/jsx-indent': ['error', 2, { checkAttributes: false, indentLogicalExpressions: false }],
  'react/no-unescaped-entities': 'off',
  'react/no-deprecated': 'off',
  'react/prop-types': 'off'
};

const reactNativeRules = {
  'react-native/no-unused-styles': 2,
  'react-native/split-platform-components': 2,
  'react-native/no-inline-styles': 2,
  'react-native/no-color-literals': 2,
  'react-native/no-raw-text': 2,
  'react-native/no-single-element-style-arrays': 2
}

const typescriptRules = {
  '@typescript-eslint/explicit-member-accessibility': 'off',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-require-imports': 'off', // these are needed for images
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      args: 'none',
      varsIgnorePattern: '^_|error|e'
    }
  ],
  '@typescript-eslint/no-empty-object-type': 'off',
  'arrow-parens': ['error', 'always'],
  'arrow-spacing': ['error', { before: true, after: true }],
  'brace-style': ['error'],
  'comma-dangle': ['error', 'never'],
  curly: ['error', 'all'],
  'dot-notation': ['error'],
  'eol-last': ['error'],
  indent: ['error', 2, { SwitchCase: 1 }],
  'key-spacing': ['error', { mode: 'strict' }],
  'keyword-spacing': ['error', { before: true, after: true }],
  'no-case-declarations': 'off',
  'no-constant-condition': ['error', { checkLoops: false }],
  'no-multi-spaces': ['error', { ignoreEOLComments: true }],
  'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
  'no-trailing-spaces': ['error'],
  'no-unexpected-multiline': 'error',
  'no-unused-vars': 'off',
  'no-useless-escape': 'off',
  'object-curly-spacing': ['error', 'always'],
  'object-shorthand': ['error', 'properties'],
  'padded-blocks': ['error', 'never'],
  'prefer-const': ['error', { destructuring: 'any' }],
  'prefer-destructuring': [
    'error',
    {
      AssignmentExpression: { array: false, object: false },
      VariableDeclarator: { array: false, object: true }
    }
  ],
  'prefer-template': ['error'],
  'quote-props': ['error', 'as-needed'],
  quotes: ['error', 'single'],
  semi: 'off',
  'space-in-parens': ['error'],
  'space-infix-ops': ['error'],
  'space-unary-ops': ['error'],
  'template-curly-spacing': ['error', 'never']
}

module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react', 'react-native', 'import'],
  rules: {
    ...importRules,
    ...reactRules,
    ...reactNativeRules,
    ...typescriptRules
  },
  ignorePatterns: ['node_modules/']
};
