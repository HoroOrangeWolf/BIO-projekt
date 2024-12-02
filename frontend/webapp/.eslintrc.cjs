module.exports = {
    root: true,
    env: {browser: true, es2020: true, node: true},
    extends: [
        'airbnb',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
        "plugin:import/recommended",
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: {ecmaVersion: 'latest', sourceType: 'module'},
    settings: {react: {version: '18.2'}},
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'react', 'react-hooks'],
    rules: {
        "linebreak-style": ['off'],
        'max-len': ['error', { code: 160 }],
        'react/jsx-filename-extension': ['off'],
        'react/react-in-jsx-scope': ['off'],
        'import/prefer-default-export': ['off'],
        'react/destructuring-assignment': ['off'],
        "import/no-unresolved": "off",
        'no-useless-catch': ['off'],
        'react/require-default-props': ['off'],
        'no-param-reassign': ['off'],
        '@typescript-eslint/no-explicit-any': 'off',
        'camelcase': ['off'],
        'react/jsx-props-no-spreading': ['off'],
        'react/jsx-no-target-blank': 'off',
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
        "react/function-component-definition": [
            2,
            {
                namedComponents: "arrow-function",
                unnamedComponents: "arrow-function"
            }
        ]
    },
}
