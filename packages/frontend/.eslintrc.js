const restrictedGlobals = require('confusing-browser-globals');

const unusedVarExceptions = {
    argsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    ignoreRestSiblings: true,
};

module.exports = {
    parserOptions: {
        project: './tsconfig.json',
        createDefaultProgram: true,
    },
    ignorePatterns: ['**/styles/*.css'],
    extends: [
        './../../.eslintrc.js',
        'plugin:@typescript-eslint/recommended',
        'plugin:css-modules/recommended',
        'plugin:import/recommended',
        'plugin:json/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'airbnb-typescript',
        'prettier',
    ],
    plugins: [
        '@typescript-eslint',
        'css-modules',
        'import',
        'json',
        'jsx-a11y',
        'prettier',
        'react-hooks',
        'react',
    ],

    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'no-restricted-globals': ['error'].concat(restrictedGlobals),
        'react/prop-types': 'off',
        'no-unused-vars': ['error', unusedVarExceptions],
        '@typescript-eslint/no-unused-vars': ['error', unusedVarExceptions],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'variable',
                format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                leadingUnderscore: 'allow',
            },
        ],
        'react-hooks/exhaustive-deps': 'error',

        // TODO: enable these rules once the codebase is fixed
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-named-as-default': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-autofocus': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'prefer-const': 'off',
        'prefer-spread': 'off',
        'react/display-name': 'off',
        'react/jsx-key': 'error',
        'react/no-unescaped-entities': 'off',
        'react/react-in-jsx-scope': 'off',
        eqeqeq: 'off',
    },
};
