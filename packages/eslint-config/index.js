/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: false,

  env: {
    es2022: true,
    node: true
  },

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],

  rules: {
    // Monorepo sanity
    "no-unused-vars": "off",

    // Shared packages must stay runtime-agnostic
    "no-restricted-imports": [
      "error",
      {
        paths: [
          { name: "fs", message: "Node-only API forbidden in shared packages." },
          { name: "path", message: "Node-only API forbidden in shared packages." }
        ]
      }
    ]
  }
};
