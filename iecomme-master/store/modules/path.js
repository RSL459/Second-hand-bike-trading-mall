export default ({
	state: {
		a: 1,
		list: [{
				name: "张三",
				tel: "1111111",
				city: "杭州市西湖区",
				details: "2号楼",
				isDefault: false
			},
			{
				name: "李四",
				tel: "1111111",
				city: "杭州市西湖区",
				details: "2号楼",
				isDefault: true
			}
		]
	},
	mutations: {
		//新建收货地址
		createPath(state, obj) {
			state.list.unshift(obj);
		},
		//修改收货地址
		updatePath(state, {
			index,
			item
		}) {
			for (let key in item) {
				state.list[index][key] = item[key];
			}
		},
		//清空当前默认收货地址
		removePath(state) {
			state.list.forEach(v => {
				if (v.isDefault) {
					v.isDefault = false;
				}
			})
		}
	},
	actions: {
		//新建收货地址
		createPathFn({
			commit
		}, obj) {
			if (obj.isDefault) {
				commit('removePath');
			}
			commit('createPath', obj);
		},
		//修改收货地址
		updatePathFn({
			commit
		}, obj) {
			if (obj.item.isDefault) {
				commit('removePath');
			}
			commit('updatePath', obj);
		}
	},
	getters: {

	}
})