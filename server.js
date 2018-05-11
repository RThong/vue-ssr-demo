const Koa = require('koa')
const Router = require('koa-router')
const ejs = require('ejs')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverConfig = require('./build/webpack.config.server')

const serverCompiler = webpack(serverConfig)

const mfs = new MemoryFs()

serverCompiler.outputFileSystem = mfs

const isDev = process.env.NODE_ENV === 'development'

const app = new Koa()

app.use(async (ctx, next)=>{
	try {
		console.log(`request with path ${ctx.path}`)
		await next()
	} catch (err){
		console.log(err)
		ctx.status = 500
		if(isDev){
			ctx.body = err.message
		}
		else{
			ctx.bosy = 'please try again later'
		}
	}
})

let bundle
serverCompiler.watch({}, (err, stats)=>{
	//打包错误
	if(err){
		throw err
	}

	stats = stats.toJson()
	//非打包错误
	stats.errors.forEach(err => console.log(err))
	stats.warnings.forEach(warn => console.warn(warn))

	//bundle路径
	const bundlePath = path.join(serverConfig.output.path, 'vue-ssr-server-bundle.json')
	//读取bundle
	bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
	console.log('new bundle generated')
})

const router = new Router()
router.get('*', async (ctx) => {
	if(!bundle){
		ctx.body = '等一会，别着急'
		return
	}
	//为返回给客户端添加html  和前端路由交互的js
	const clientManifestResp = await axios.get('http://127.0.0.1:8000/public/vue-ssr-client-manifest.json')
	const clientManifest = clientManifestResp.data
	// console.log('---------------------------------',clientManifest)
	//读取template模板
	const template = fs.readFileSync(path.join(__dirname, './server.template.ejs'), 'utf-8')

	const renderer = VueServerRenderer.createBundleRenderer(bundle, {
											inject: false,
											clientManifest
										})


	ctx.headers['Content-Type'] = 'text/html'

	const context = {url: ctx.path}
	try{
		// console.log('---------------------------------before render')
		const appString = await renderer.renderToString(context)
		// console.log('---------------------------------after render')

		const html = ejs.render(template, {
			appString,
			style: context.renderStyles(),
			scripts: context.renderScripts()
		})

		ctx.body = html
	}catch(err){
		console.log('render error', err)
		throw err
	}
	
})

app.use(router.routes()).use(router.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || '3333'

app.listen(PORT, HOST, () => {
	console.log(`server is listening on ${HOST}:${PORT}`)
})
