<template>
	<view class="my-add-path pageBg">

		<view class="path-item">
			<view>收 件 人</view>
			<input type="text" placeholder="收件人姓名" v-model="pathObj.name"></input>
		</view>

		<view class="path-item">
			<view>手 机 号</view>
			<input type="text" placeholder="11位手机号" v-model="pathObj.tel"></input>
		</view>

		<view class="path-item">
			<view>所在地址</view>
			<input type="text" placeholder="省-市-区" v-model="pathObj.city"></input>
		</view>

		<view class="path-item">
			<view>详细地址</view>
			<input type="text" placeholder="5-60个字符" v-model="pathObj.details"></input>
		</view>

		<view class="path-item">
			<view>设为默认地址</view>
			<radio-group name="" @change="radioChange">
				<label class="radio">
					<radio :checked="pathObj.isDefault" value="" color="#FF3333" /><text></text>
				</label>
			</radio-group>
		</view>

	</view>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				// pickerValueDefault:[0,0,1],
				pathObj: {
					name: "",
					tel: "",
					city: "",
					details: "",
					isDefault: false

				},
				i: -1,
				//是否修改状态
				isStatus: false,
				addr: null
			}
		},
		computed: {
			// ...mapState(['GlobalUserId']) // 映射全局变量到计算属性
			...mapState({
				GlobalUserId: state => state.m_user.GlobalUserId,
				GlobalUserName: state => state.m_user.GlobalUserName,
			})
		},
		components: {
		},
		onLoad(e) {
			//有原地址信息传入
			if (e.data) {
				console.log(e.data);
				uni.setNavigationBarTitle({
					title: "修改地址"
				})
				let result = JSON.parse(e.data);
				// this.pathObj=result.item;
				this.pathObj.name = result.item.P_name;
				this.pathObj.tel = result.item.p_tel;
				this.pathObj.city = result.item.p_city;
				this.pathObj.details = result.item.p_details;
				this.pathObj.isDefault = result.item.P_isDefault;
				this.addr = result.item.P_id;
				console.log(this.pathObj);
				this.i = result.index;
				this.isStatus = true;
			}

		},
		onNavigationBarButtonTap() {
			console.log('return1')
			console.log(this.isStatus)
			if (this.isStatus) {
				//修改
				console.log('return')
				uni.request({
					// 替换为实际的后端 API URL
					url: 'http://localhost:3000/updateUserAddress',
					method: 'PUT',
					data: {
						name: this.pathObj.name,
						tel: this.pathObj.tel,
						city: this.pathObj.city,
						details: this.pathObj.details,
						isdefault: this.pathObj.isDefault,
						userId: this.GlobalUserId,
						addressId: this.addr,
					},
					//请求成功，判断地址是否更新成功
					success: (res) => {
						if (res.statusCode === 200) {
							uni.showToast({
								title: '地址更新成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: res.data.message || '更新失败',
								icon: 'none'
							});
						}
					},
					//请求失败
					fail: () => {
						uni.showToast({
							title: '请求失败，请重试',
							icon: 'none'
						});
					}
				});
				uni.navigateBack({
					delta: 1,
				})
			} else {
				console.log('return')
				this.createPathFn(this.pathObj)
				//新增
				uni.request({
					url: "http://localhost:3000/addPath",
					method: 'post',
					data: {
						P_userid: this.GlobalUserId, // 替换为实际的用户ID
						P_name: this.pathObj.name,
						p_tel: this.pathObj.tel,
						p_city: this.pathObj.city,
						p_details: this.pathObj.details,
						P_isDefault: this.pathObj.isDefault // 是否为默认地址
					},
					success: (res) => {
						console.log(res.data);
					},
					fail: (error) => {
						console.error('请求失败:', error);
						uni.showToast({
							title: "添加失败",
							icon: 'fail'
						})
					}
				});
				uni.navigateBack({
					delta: 1,
				})
			}
		},
		methods: {
			...mapActions(["createPathFn", "updatePathFn"]),
			radioChange(e) {
				console.log(this.pathObj.isDefault)
				console.log(e)
				this.pathObj.isDefault = !this.pathObj.isDefault;

			},
			updateDefaultPath(id) {
				if (!id) {
					uni.showToast({
						title: '缺少记录 ID',
						icon: 'none'
					});
					return;
				}

				uni.request({
					url: 'http://localhost:3000/updateDefault', // 后端 API 的 URL
					method: 'POST',
					data: {
						id: id // 要更新的记录 ID
					},
					success: (res) => {
						if (res.data.success) {
							uni.showToast({
								title: '更新成功，可以插入或更新新的 P_isDefault 为 TRUE 的记录',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: res.data.message || '更新失败，请重试',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '请求失败',
							icon: 'none'
						});
						console.error('更新请求失败:', err);
					}
				});
			}
		}
	}
</script>

<style>
	.my-add-path {
		padding-left: 20rpx;
	}

	.path-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 0;
		border-bottom: 2rpx solid #CCCCCC;
		padding: 20px;
	}

	.path-item input {
		flex: 1;
		text-align: left;
		padding-left: 10rpx;
	}
</style>