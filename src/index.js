import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './app.vue'

import createRouter from './config/router'

Vue.use(VueRouter)

const router = createRouter()


new Vue({
	el: '#root',
	router,
	render: (h) => h(App)
})