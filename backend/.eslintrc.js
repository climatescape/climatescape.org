module.exports = {
  env: {
    browser: false,
    node: true,
    es6: true,
  },
  plugins: ["prettier", "jest"],
  extends: [
    "airbnb",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
  ],
  rules: {
    "no-console": "off",
    "func-names": ["error", "as-needed"],
    "no-unused-vars": ["error", { "args": "none"}],
    "jest/valid-expect": "off", // jest-expect-message adds a parameter to expect()
  },
}