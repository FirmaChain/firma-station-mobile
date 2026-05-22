import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

import { getDefaultConfig, mergeConfig } from '@react-native/metro-config';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer/react-native')
    },
    resolver: {
        assetExts: assetExts.filter((ext) => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg'],
        extraNodeModules: {
            fs: require.resolve('react-native-fs') //! Required
        },
        resolveRequest: (context, moduleName, platform) => {
            if (moduleName === 'crypto') {
                // when importing crypto, resolve to react-native-quick-crypto
                return context.resolveRequest(context, 'react-native-quick-crypto', platform);
            }
            // otherwise chain to the standard Metro resolver.
            return context.resolveRequest(context, moduleName, platform);
        }
    }
};

export default mergeConfig(defaultConfig, config);
