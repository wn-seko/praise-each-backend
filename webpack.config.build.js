const config = require('./webpack.config')

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

module.exports = config
