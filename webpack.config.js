// @ts-check
/**
 * @typedef {import("webpack").Configuration} Configuration
 * @typedef {import("webpack").Output} Output
 * @typedef {import("webpack").Entry} Entry
 * @typedef {import("webpack").Resolve} Resolve
 * @typedef {import("webpack").Rule} Rule
 * @typedef {import("webpack").Module} Module
 * @typedef {import("webpack").Plugin} Plugin
 * @typedef {import("webpack").PerformanceOptions} PerformanceOptions
 * @typedef {import("webpack").WatchOptions} WatchOptions
 */
const path = require('path')
const ForkTsChecker = require('fork-ts-checker-webpack-plugin')
const webpack = require('webpack')

/**
 * @type {Configuration}
 */
module.exports = {
  target: 'node',
  mode: 'production',

  /**
   * @type {Entry}
   */
  entry: {
    server: './src/server.ts',
  },

  /**
   * @type {Output}
   */
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },

  /**
   * @type {Resolve}
   */
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.js'],
  },

  /**
   * @type {Module}
   */
  module: {
    /**
     * @type {Rule[]}
     */
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },

  /**
   * @type {Plugin[]}
   */
  plugins: [
    new ForkTsChecker(),
    new webpack.IgnorePlugin(/mariasql/, /\/knex\//),
    new webpack.IgnorePlugin(/mssql/, /\/knex\//),
    new webpack.IgnorePlugin(/mysql/, /\/knex\//),
    new webpack.IgnorePlugin(/mysql2/, /\/knex\//),
    new webpack.IgnorePlugin(/oracle/, /\/knex\//),
    new webpack.IgnorePlugin(/oracledb/, /\/knex\//),
    new webpack.IgnorePlugin(/pg-query-stream/, /\/knex\//),
    new webpack.IgnorePlugin(/sqlite3/, /\/knex\//),
    new webpack.IgnorePlugin(/strong-oracle/, /\/knex\//),
    new webpack.IgnorePlugin(/pg-native/, /\/pg\//),
    new webpack.ContextReplacementPlugin(/any-promise/),
    new webpack.NormalModuleReplacementPlugin(/\.\.\/migrate/, 'node-noop'),
    new webpack.NormalModuleReplacementPlugin(/\.\.\/seed/, 'node-noop'),
  ],

  /**
   * @type {PerformanceOptions}
   */
  performance: {
    maxEntrypointSize: 1000 * 1000,
    maxAssetSize: 800 * 1000,
  },

  /**
   * @type {WatchOptions}
   */
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 600,
    poll: 800,
  },
}
