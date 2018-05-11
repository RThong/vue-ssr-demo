const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

const isDev = process.env.NODE_ENV === 'development'

let config
config = {
	mode: process.env.NODE_ENV,
	target: 'node',
	devtool: 'source-map',
	entry: path.join(__dirname, '../src/server-entry.js'),
	output: {
		libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../server-dist'),
    filename: 'bundle.js'
  },
  externals: Object.keys(require('../package.json').dependencies),
  module: {
  	rules:[
	  	{
	  		test: /\.styl/,
	  		use: ExtractPlugin.extract({
          fallback: 'vue-style-loader',
          use: [
          'css-loader',         
          'stylus-loader'
          ]
        })
	  	},
	  	{
	  		test:/\.vue$/,
	  		loader:'vue-loader'
	  	}
  	]
  },
  plugins: [
  	//定义环境变量
  	new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueLoaderPlugin(),
    new VueServerPlugin(),
    new ExtractPlugin('styles.css'),
  ]
}

module.exports = config

