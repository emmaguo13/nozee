/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, path: false }
    config.experiments = { asyncWebAssembly: true, layers: true }

    return config
  }
}

module.exports = nextConfig
