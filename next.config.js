const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require('next/constants');

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

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    config.rewrites = async () => [{
      source: '/api/:slug*',
      destination: 'http://127.0.0.1:8000/:slug*',
    },
    ];
  }

  if (phase === PHASE_PRODUCTION_SERVER) {
    config.rewrites = async () => [{
      source: '/api/:slug*',
      destination: 'https://api.epicteller.com/:slug*',
    },
    ];
  }

  return config;
};
