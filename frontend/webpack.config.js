const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = require('./config.js');
const { getRoutesToPrerender } = require('./src/server/routes.js');

const htmlPluginSettings = {
  template: './src/index.html.jsx',
  favicon: './src/assets/images/favicon.ico',
  title: config.ProjectFQDomain,
  description: config.Description,
  scriptLoading: 'defer',
  inject: true,
};

module.exports = (env = {}, { mode } = {}) => {
  const isProd =
    env.production ||
    ['production', 'staging'].includes(process.env.NODE_ENV) ||
    mode === 'production';

  if (isProd) {
    process.env.BABEL_ENV = 'production';
  }

  const cssLoader = {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
      importLoaders: 1,
      sourceMap: !isProd,
    },
  };

  const base = {
    mode: isProd ? 'production' : 'development',
    output: {
      path: `${__dirname}/dist`,
      filename: isProd ? '[name].[hash].js' : '[name].js',
      publicPath: isProd ? '/' : 'http://localhost:8080/',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.md$/,
          use: ['html-loader', 'markdown-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?[a-z0-9=]+)?$/,
          use: 'file-loader',
        },
        {
          test: /\.js$/,
          include: path.join(__dirname, 'src'),
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          include: path.join(__dirname, 'src'),
          loaders: [
            isProd ? { loader: MiniCssExtractPlugin.loader } : { loader: 'style-loader' },
            cssLoader,
            { loader: 'postcss-loader' },
          ],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          loaders: [
            isProd ? { loader: MiniCssExtractPlugin.loader } : { loader: 'style-loader' },
            { loader: 'css-loader' },
          ],
        },
        {
          test: /\.html.jsx$/,
          use: '@bjacobel/vhtml-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json', '.css'],
      modules: [__dirname, path.resolve(__dirname, 'src'), 'node_modules'],
    },
    node: {
      constants: false,
    },
    optimization: {
      noEmitOnErrors: true,
      splitChunks: {
        chunks: 'async',
        minChunks: 1,
        name: true,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            enforce: true,
            chunks: 'initial',
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 8,
            mangle: {
              keep_fnames: /Error$/,
              keep_classnames: /Error$/,
            },
          },
        }),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
        'process.env.GITHUB_SHA': JSON.stringify(process.env.GITHUB_SHA || 'unreleased'),
        process: undefined,
        projectConfig: JSON.stringify(config),
      }),
      isProd &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].[contenthash].css',
        }),
    ].filter(Boolean),
    devServer: {
      hot: true,
      publicPath: '/',
      historyApiFallback: true,
      overlay: true,
    },
    performance: {
      maxAssetSize: 350000,
      maxEntrypointSize: 500000,
      hints: isProd ? 'warning' : false,
    },
  };

  const appBuild = {
    name: 'app',
    ...base,
    entry: {
      main: './src/index.js',
    },
    plugins: [
      ...base.plugins,
      !isProd && new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin(htmlPluginSettings),
    ].filter(Boolean),
  };

  const serverBuild = {
    name: 'server',
    ...base,
    entry: {
      server: './src/server/entry.js',
    },
    devtool: false,
    optimization: {
      noEmitOnErrors: true,
    },
    plugins: [
      ...base.plugins,
      ...getRoutesToPrerender().map(
        url =>
          new HtmlWebpackPlugin({
            ...htmlPluginSettings,
            template: `!!prerender-loader?${JSON.stringify({
              string: true,
              params: { url },
            })}!./dist/index.html`,
            filename: path.join(__dirname, `/dist${url}index.html`),
            inject: false,
          }),
      ),
    ],
  };

  return [appBuild, isProd && serverBuild].filter(Boolean);
};
