module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    quotes: "off", // Disable quotes rule for backend
    "prettier/prettier": [
      "error",
      {
        singleQuote: false, // Allow double quotes in backend
      },
    ],
  },
  plugins: ["prettier"], // Add prettier plugin for the backend too
};
