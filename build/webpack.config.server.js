const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const HTMLplugin = require('html-webpack-plugin')


const isDev = process.env.NODE_ENV === 'development'

let config
config = {
	mode: process.env.NODE_ENV,
	target: 'web',
	entry: path.join(__dirname, '../src/index.js'),
	output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  module: {
  	rules:[
	  	{
	  		test:/\.css$/,
	  		use:['style-loader','css-loader'],
	  		exclude: /node_modules/
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
    new HTMLplugin()//html
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
			index: '/index.html'
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

