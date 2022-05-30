const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_SERVER,
  PHASE_EXPORT,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
  const config = {
    ...defaultConfig,
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
      domains: ['img.epicteller.com'],
    },
    experimental: {
      images: {
        layoutRaw: true,
      },
    },
  };
  config.rewrites = async () => [{
    source: '/api/:slug*',
    destination: `${process.env.PROXY_API}/:slug*`,
  },
  ];

  return config;
};
