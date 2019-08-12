const path = require('path')
const webpack = require('webpack')
const htmlWQebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'dist')
  },
  plugins: [
    new htmlWQebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}