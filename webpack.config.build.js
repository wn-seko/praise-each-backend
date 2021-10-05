const config = require('./webpack.config')
const webpack = require('webpack')
const ForkTsChecker = require('fork-ts-checker-webpack-plugin')

config.module.rules = [
  {
    test: /\.ts$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          configFile: 'tsconfig.build.json',
        },
      },
    ],
  },
]

config.plugins = [
  new ForkTsChecker({
    typescript: {
      configFile: 'tsconfig.build.json',
    },
  }),
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
]

module.exports = config
