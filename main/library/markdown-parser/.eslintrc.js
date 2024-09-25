module.exports = {
  "root": true,
  "overrides": [
    {
      "files": ["*.ts"],
      "parserOptions": {
        "project": ["tsconfig.json"],
        "createDefaultProgram": true,
        "tsconfigRootDir": __dirname
      },
      "extends": ["prettier", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
      "plugins": ["unused-imports"],
      "rules": {
        "@typescript-eslint/no-unused-vars": ["error", { "ignoreRestSiblings": true }],
        "@typescript-eslint/no-explicit-any": "error",
        "unused-imports/no-unused-imports": "error"
      }
    }
  ]
}
