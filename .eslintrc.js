module.exports = {
  root: true,
  extends: ['@react-native', 'standard'],
  rules: {
    semi: ['error', 'never'],
    'space-before-function-paren': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'multiline-ternary': 'off',
    'no-sequences': ['error', { allowInParentheses: true }]
  }
}
