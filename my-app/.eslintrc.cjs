// module.exports = {
//   root: true,
//   env: { browser: true, es2020: true },
//   extends: [
//     'eslint:recommended',
//     'plugin:react/recommended',
//     'plugin:react/jsx-runtime',
//     'plugin:react-hooks/recommended',
//   ],
//   ignorePatterns: ['dist', '.eslintrc.cjs'],
//   parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
//   settings: { react: { version: '18.2' } },
//   plugins: ['react-refresh'],
//   rules: {
//     'react-refresh/only-export-components': [
//       'warn',
//       { allowConstantExport: true },
//     ],
//   },
// }

const PATHS = require('./../paths');
const rootImportRegex = '~/(components|chains|output-types|utilities)/';

module.exports = {
	parser: 'babel-eslint',
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
	},
	settings: {
		'import/resolver': {
			webpack: {
				config: `${PATHS.config}/webpack.base.js`,
			},
		},
	},
	extends: [
		'airbnb-base',
		'plugin:react/recommended',
		'plugin:jest/recommended',
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 6,
		ecmaFeatures: {
			jsx: true,
		},
	},
	rules: {
		'max-len': [2, 120, 2],
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
		'import/no-unresolved': ['error', { ignore: [rootImportRegex] }],
		'import/extensions': ['warning', 'ignorePackages'],
	},
};
