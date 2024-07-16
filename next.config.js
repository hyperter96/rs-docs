const withMarkdoc = require('@markdoc/next.js')
const { withPlausibleProxy } = require('next-plausible')
const { i18n } = require('./i18nConfig')
const isBrowser = typeof window !== 'undefined'

/** @type {import('next').NextConfig} */
const nextConfig = withMarkdoc()({
  swcMinify: true,
  // reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md'],
  experimental: {
    scrollRestoration: true,
  },
  i18n,
  trailingSlash: true,
  // Can be safely removed in newer versions of Next.js
  webpack5: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
        config.resolve = {
            ...config.resolve,
            fallback: {
                fs: false,
            },
        };
    }
    return config;
},
  partialBundledLanguages: isBrowser && true,
})

module.exports = withPlausibleProxy()(nextConfig)
