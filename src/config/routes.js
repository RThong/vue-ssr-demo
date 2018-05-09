export default [
	{
		path: '/',
		redirect: '/index'
	},
	{
		// path: '/app/:id',
		path: '/index',
		component: () => {
			return import('../views/index/index.vue')
		},
		meta: {
			title: 'this is app',
			description: 'adsafsf'
		}
	},
	{
		path: '/home',
		component: () => {
			return import('../views/home/home.vue')
		}
	}
]