const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
  const config = {
    ...defaultConfig,
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

  if (true || phase === PHASE_DEVELOPMENT_SERVER) {
    config.rewrites = async () => [{
      source: '/api/:slug*',
      destination: 'http://127.0.0.1:8000/:slug*',
    },
    ];
  }

  return config;
};
