module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add rule to handle fast-png and other modern JS modules
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        include: /node_modules\/(fast-png|iobuffer)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['>0.2%', 'not dead', 'not op_mini all']
                }
              }]
            ],
            plugins: [
              '@babel/plugin-transform-class-properties',
              '@babel/plugin-transform-private-methods'
            ]
          }
        }
      });
      
      return webpackConfig;
    }
  }
};
