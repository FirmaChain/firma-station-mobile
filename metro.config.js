const { getDefaultConfig } = require('metro-config');
const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues();

module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true
            }
        })
    },
    resolver: {
        ...defaultResolver,
        sourceExts: [...defaultResolver.sourceExts, 'cjs'],
        extraNodeModules: {
            zlib: require.resolve('browserify-zlib'),
            constants: require.resolve('constants-browserify'),
            crypto: require.resolve('react-native-crypto'),
            dns: require.resolve('dns.js'),
            net: require.resolve('react-native-tcp-socket'),
            domain: require.resolve('domain-browser'),
            http: require.resolve('@tradle/react-native-http'),
            https: require.resolve('@tradle/react-native-http'),
            os: require.resolve('react-native-os'),
            path: require.resolve('path-browserify'),
            querystring: require.resolve('querystring-es3'),
            fs: require.resolve('react-native-level-fs'),
            _stream_transform: require.resolve('readable-stream/transform'),
            _stream_readable: require.resolve('readable-stream/readable'),
            _stream_writable: require.resolve('readable-stream/writable'),
            _stream_duplex: require.resolve('readable-stream/duplex'),
            _stream_passthrough: require.resolve('readable-stream/passthrough'),
            dgram: require.resolve('react-native-udp'),
            timers: require.resolve('timers-browserify'),
            stream: require.resolve('stream-browserify'),
            tty: require.resolve('tty-browserify'),
            vm: require.resolve('vm-browserify'),
            tls: false,
            assert: require.resolve('assert'),
            buffer: require.resolve('buffer'),
            punycode: require.resolve('punycode'),
            string_decoder: require.resolve('string_decoder'),
            url: require.resolve('url')
        }
    }
};
