const webpack = require('webpack');

module.exports = (config) => {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    'assert': require.resolve('assert'),
    'aysnc_hooks': require.resolve('async_hooks'),
    'buffer': require.resolve('buffer'),
    'console': require.resolve('console-browserify'),
    'crypto': require.resolve('crypto-browserify'),
    'fs': require.resolve('browserify-fs'),
    'http': require.resolve('stream-http'),
    'https': require.resolve('https-browserify'),
    'net': require.resolve('net-browserify'),
    'os': require.resolve('os-browserify'),
    'path': require.resolve('path-browserify'),
    'stream': require.resolve('stream-browserify'),
    'tls': require.resolve('tls-browserify'),
    'url': require.resolve('url'),
    'zlib': require.resolve('browserify-zlib')
  })
  config.resolve.fallback = fallback;
  // config.plugins = (config.plugins || []).concat([
  //   new webpack.ProvidePlugin({
  //     process: 'process/browser',
  //     Buffer: ['buffer', 'Buffer']
  //   })
  // ])
  return config
}
