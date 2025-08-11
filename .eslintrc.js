module.exports = {
    root: true,
    extends: ['@react-native', 'prettier'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'prettier/prettier': ['error', { endOfLine: 'auto' }], // remove `␍` errors
                '@typescript-eslint/no-shadow': ['error'],
                'no-shadow': 'off',
                'no-undef': 'off',
            },
        },
    ],
};
