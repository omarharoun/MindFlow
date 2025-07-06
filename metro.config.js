const { getDefaultConfig } = require('@expo/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Optimize resolver
config.resolver = {
  ...config.resolver,
  alias: {
    // Handle react-native-maps for web
    'react-native-maps': require.resolve('./emptyModule.js'),
  },
};

module.exports = config; 