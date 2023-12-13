module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "google", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  ignorePatterns: ["**/node_modules/*", "**/build/*"],
  rules: {
    "require-jsdoc": 0,
    "react/react-in-jsx-scope": 0,
    "no-undef": 2,
    "react/prop-types": 0,

  },
};

