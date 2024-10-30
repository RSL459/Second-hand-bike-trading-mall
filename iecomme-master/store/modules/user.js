export default ({
	state: {
		a: 1,
		GlobalUserId: 1, //定义全局变量
		GlobalUserName: "张三"
	},
	mutations: {
		setGlobalId(state, payload) {
			state.GlobalUserId = payload; // 设置全局变量
		},
		setGlobalName(state, payload) {
			state.GlobalUserName = payload; // 设置全局变量
		}
	},
	actions: {

	},
	getters: {
		getUserId(state) {
			return state.GlobalUserId;
		},
		getUserName(state) {
			return state.GlobalUserName;
		}
	}
})