/** @type {import('next').NextConfig} */

const Webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, path: false }
    config.experiments = { asyncWebAssembly: true, layers: true }

    // Add a new plugin that provides the TransformStream polyfill
    config.plugins.push(
      new Webpack.ProvidePlugin({
        // TransformStream: ['web-streams-polyfill/ponyfill/es2018', 'TransformStream'],
        // ReadableStream: ['web-streams-polyfill/ponyfill/es2018', 'ReadableStream'],
        // WritableStream: ['web-streams-polyfill/ponyfill/es2018', 'WritableStream'],
      })
    );

    return config
  }
}

export default nextConfig
