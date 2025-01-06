const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const AddCopyrightWebpackPlugin = require('./plugins/add-copyright-webpack-plugin');
const LogBuildTimeWebpackPlugin = require('./plugins/log-build-time-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = (
  env, // 透過 webpack --env foo='bar' 傳進來的參數
  arg // 透過 webpack --mode=development 傳進來的參數
) => {
  return {
    mode: isDev ? 'development' : 'production',

    context: path.resolve(__dirname, './src'),

    entry: {
      main: './index.tsx'
    },

    output: {
      filename: './js/[name].[contenthash].js',
      chunkFilename: './js/chunks/[name].[chunkhash].chunk.js',
      clean: true,
      assetModuleFilename: './assets/images/[name].[contenthash][ext]',
      publicPath: '/'
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.scss'],
    },

    optimization: {
      chunkIds: 'named',

      splitChunks: {
        chunks: 'all'
      },

      minimizer: [
        '...',

        new CssMinimizerWebpackPlugin()
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './assets/index.html',
        title: 'webpack-react',
        favicon: './assets/favicon.ico'
      }),

      // 將 ./public 中的所有檔案打包到 ./dist 中
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './public'),
            to: path.resolve(__dirname, './dist'),
          }
        ]
      }),

      new MiniCssExtractPlugin({
        filename: 'assets/styles/[name].[contenthash].css',
        chunkFilename: 'assets/styles/[name].[chunkhash].chunk.css'
      }),

      new AddCopyrightWebpackPlugin({
        content: '© Created by John H'
      }),

      new LogBuildTimeWebpackPlugin()
    ],

    module: {
      rules: [
        {
          test: /\.(tsx?)$/,
          use: 'ts-loader',
        },

        {
          test: /\.(png|jpe?g|svg|gif)$/i,
          type: 'asset'
        },

        {
          test: /\.scss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'local'
                },
              }
            },
            'sass-loader'
          ]
        },
      ],
    },

    devServer: {
      port: 3000,
      hot: true,

      // 對於所有 URL 都回傳 index.html
      historyApiFallback: true,
      static: [
        {
          directory: path.resolve(__dirname, './public'),
          watch: true,
          publicPath: '/',
        }
      ]
    }
  }
}