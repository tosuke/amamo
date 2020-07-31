const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CSSExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const dev = process.env.NODE_ENV !== 'production';

/**
 * @type{ import('webpack').Configuration }
 */
module.exports = {
  entry: {
    main: [path.join(__dirname, 'src/index.tsx')],
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
        use: [CSSExtractPlugin.loader, 'css-loader'],
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
    ...(process.env.BUNDLE_ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
    new DotenvPlugin({ safe: true, systemvars: true }),
    new CSSExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new HTMLPlugin({
      template: path.join(__dirname, 'src/index.html'),
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSPlugin()],
  },
  devServer: {
    historyApiFallback: true,
  },
};
