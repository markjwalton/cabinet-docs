// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'next/core-web-vitals', 'plugin:storybook/recommended'],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks' // Explicitly include the react-hooks plugin
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    // These two rules are critical for preventing hook errors
    'react-hooks/rules-of-hooks': 'error', // Enforces Rules of Hooks
    'react-hooks/exhaustive-deps': 'warn'  // Checks effect dependencies
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}

