module.exports = {
    root: true,
    extends: '@react-native',
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
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
