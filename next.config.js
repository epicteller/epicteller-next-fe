/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: 'https://api.epicteller.com/api/:slug*',
      },
    ];
  },
};
