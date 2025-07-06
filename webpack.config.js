const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ignore react-native-maps on web
  config.resolve.alias['react-native-maps'] = false;
  
  // Simple fix for expo-router web context
  config.plugins.push(
    new (require('webpack')).DefinePlugin({
      'process.env.EXPO_ROUTER_APP_ROOT': JSON.stringify(process.cwd()),
    })
  );

  return config;
}; 