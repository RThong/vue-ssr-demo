const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const HTMLplugin = require('html-webpack-plugin')
const VueClientPlugin = require('vue-server-renderer/client-plugin')


const isDev = process.env.NODE_ENV === 'development'

let config
config = {
	mode: process.env.NODE_ENV,
	target: 'web',
	entry: path.join(__dirname, '../src/client-entry.js'),
	output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.js',
    publicPath: 'http://127.0.0.1:8000/public/'
  },
  module: {
  	rules:[
	  	{
	  		test: /\.styl/,
	  		use: [
	  		'vue-style-loader',
	  		'css-loader',
	  		'stylus-loader'
	  		]
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
  		'process.env': {
  			NODE_ENV: isDev ? '"development"': '"production"'
  		}
  	}),
    new VueLoaderPlugin(),
    new HTMLplugin({
	    template: path.join(__dirname, 'template.html')
	  }),//html
	  new VueClientPlugin()
  ]
}

if(isDev){
	//调试代码
	config.devtool = '#cheap-module-eval-source-map'
	//dev-server
	config.devServer = {
		port: 8000,
		host: '0.0.0.0',
		overlay: {
			errors: true
		},
		historyApiFallback: {
			index: '/public/index.html'
  	},//history模式手动刷新url会发送请求，出现错误
		hot: true
	}
	//热加载
	config.plugins.push(
		new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}

module.exports = config

