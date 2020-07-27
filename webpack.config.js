const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

/**
 * @type{ import('webpack').Configuration }
 */
module.exports = {
  entry: {
    main: [path.join(__dirname, 'src/index.tsx'), path.join(__dirname, 'src/theme.css')],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: '[name].[hash].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    ...(dev ? [new ReactRefreshPlugin({ overlay: true })] : []),
    new HTMLPlugin({
      template: path.join(__dirname, 'src/index.html'),
    }),
  ],
};
