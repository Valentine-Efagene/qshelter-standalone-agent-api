const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  target: 'node',
  entry: './src/serverless.ts',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'serverless.js',
    libraryTarget: 'commonjs2',
    sourceMapFilename: 'serverless.js.map'
  },
  externals: [
    nodeExternals({
      allowlist: ['express', 'fastify', 'uuid'],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
     /*    options: {
          transpileOnly: false, // Enable full type checking
        }, */
      },
    ],
  },
  optimization: {
    minimize: false, // Disable minification for better debugging
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  stats: {
    warnings: true, // Enable warnings for better debugging
    modules: false,
    assets: false,
  },
};