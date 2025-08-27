/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@stellar-wallet-connector/core', '@stellar-wallet-connector/react'],
}

module.exports = nextConfig
