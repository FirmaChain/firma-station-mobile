module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        'react-native-reanimated/plugin',
        '@babel/plugin-syntax-bigint',
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
                alias: {
                    '@': './src',
                    '@components': './src/components',
                    '@constants': './src/constants',
                    '@assets': './src/assets',
                    '@hooks': './src/hooks',
                    '@utils': './src/utils',
                },
            },
        ],
    ],
};
