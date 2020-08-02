const path = require('path');
const crypto = require('crypto');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');
const CSSExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const dev = process.env.NODE_ENV !== 'production';

const TOTAL_PAGES = 2;

/**
 * @type{ import('webpack').Configuration }
 */
module.exports = {
  entry: path.join(__dirname, 'src/index.tsx'),
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
    filename: '[name].[contenthash].js',
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
    new webpack.ProgressPlugin(),
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
    // Granular Chunks
    // from https://glitch.com/edit/#!/webpack-granular-split-chunks?path=webpack.config.js
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          name: 'framework',
          chunks: 'all',
          // React
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          priority: 40,
        },
        lib: {
          test(module) {
            // 160KB cut off
            return module.size() > 160000 && /node_modules[\\/]/.test(module.identifier);
          },
          name(module) {
            const hash = crypto.createHash('sha1');
            hash.update(module.libIdent({ context: 'dir' }));
            return 'lib-' + hash.digest('hex').substring(0, 8);
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: TOTAL_PAGES,
          priority: 20,
        },
        shared: {
          name(_module, chunks) {
            const hash = crypto
              .createHash('sha1')
              .update(chunks.reduce((acc, chunk) => acc + chunk.name, ''))
              .digest('hex');
            return hash;
          },
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  },
  devServer: {
    historyApiFallback: true,
  },
};
