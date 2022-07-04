module.exports = {
	parser: "@typescript-eslint/parser",
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"prettier",
	],
	plugins: ["prettier", "@typescript-eslint", "simple-import-sort"],
	parserOptions: {
		sourceType: "module",
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
	},
	rules: {
		"prettier/prettier": "error",
		"no-console": "error",
		"no-unused-vars": "off",
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
			},
		],
	},
	ignorePatterns: [".eslintrc.js"],
};
