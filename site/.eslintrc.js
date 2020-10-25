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
    "plugin:jest/recommended",
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
  plugins: ["react", "prettier", "react-hooks", "lodash-fp"],
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
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "lodash-fp/consistent-compose": "off",
    "lodash-fp/consistent-name": [
      "error",
      "_"
    ],
    "lodash-fp/no-argumentless-calls": "error",
    "lodash-fp/no-chain": "error",
    "lodash-fp/no-extraneous-args": "error",
    "lodash-fp/no-extraneous-function-wrapping": "error",
    "lodash-fp/no-extraneous-iteratee-args": "error",
    "lodash-fp/no-extraneous-partials": "error",
    "lodash-fp/no-for-each": "off",
    "lodash-fp/no-partial-of-curried": "error",
    "lodash-fp/no-single-composition": "error",
    "lodash-fp/no-submodule-destructuring": "error",
    "lodash-fp/no-unused-result": "error",
    "lodash-fp/prefer-compact": "error",
    "lodash-fp/prefer-composition-grouping": "error",
    "lodash-fp/prefer-constant": [
      "error",
      {
        "arrowFunctions": false
      }
    ],
    "lodash-fp/prefer-flat-map": "error",
    "lodash-fp/prefer-get": "error",
    "lodash-fp/prefer-identity": [
      "error",
      {
        "arrowFunctions": false
      }
    ],
    "lodash-fp/preferred-alias": "off",
  },
}
