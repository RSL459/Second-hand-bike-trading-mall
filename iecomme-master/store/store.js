// import Vue from 'vue'
// import Vuex from 'vuex'

import {
	createStore
} from 'vuex'
import moduleCart from '@/store/modules/cart.js'
import modulePath from '@/store/modules/path.js'
import moduleUser from '@/store/modules/user.js'

// Vue.use(Vuex)

const store = createStore({
	modules: {
		// 挂载地址的 vuex 模块，模块内成员的访问路径被调整为 m_path
		// 挂载笔记的 vuex 模块，模块内成员的访问路径被调整为 m_cart
		// 挂载用户的 vuex 模块，模块内成员的访问路径被调整为 m_user
		'm_cart': moduleCart,
		'm_path': modulePath,
		'm_user': moduleUser
	},
	state: {
		a: 1
	}
})

export default store