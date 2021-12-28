/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: 'http://127.0.0.1:8000/:slug*',
      },
    ];
  },
};
