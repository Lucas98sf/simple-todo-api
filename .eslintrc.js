module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		// "plugin:@typescript-eslint/recommended-requiring-type-checking",
		'prettier',
	],
	plugins: ['@typescript-eslint', 'simple-import-sort'],
	parserOptions: {
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json'],
	},
	rules: {
		'no-console': 'error',
		'no-unused-vars': 'off',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'no-magic-numbers': 'error',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
				ignoreRestSiblings: true,
			},
		],
	},
	ignorePatterns: ['.eslintrc.js', '*.config.js'],
};
