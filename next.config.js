const { i18n: i18nConfig } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    ...i18nConfig,
    localeDetection: false,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
