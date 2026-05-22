//! You must place 'react-native-worklets/plugin' at the last of plugin array.

module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                alias: {
                    '@': './src',
                    crypto: 'react-native-quick-crypto',
                    stream: 'readable-stream',
                    buffer: '@craftzdog/react-native-buffer'
                }
            }
        ],
        'react-native-worklets/plugin'
    ]
};
