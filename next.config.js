
// next.config.js
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [['@babel/plugin-transform-runtime', { regenerator: true }]],
        },
      },
    });
    return config;
  },
  assetPrefix: '.',
};
