module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {
    "react/prop-types": 0,
    "react/require-default-props": 0,
    "react/jsx-filename-extension": 0,
    "react/jsx-props-no-spreading": 0,
    "react/jsx-one-expression-per-line": 0,
    "no-param-reassign": 0,
    "import/prefer-default-export": 0,
    "react/forbid-prop-types": 0,
    "react/button-has-type": 0,
    "no-nested-ternary": 0,
    "no-restricted-syntax": 0,
  },
}
