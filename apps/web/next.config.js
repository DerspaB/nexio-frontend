/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@nexio/api-client',
    '@nexio/constants',
    '@nexio/types',
    '@nexio/validations',
  ],
};

module.exports = nextConfig;
