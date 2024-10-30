<template>
	<view class="my-path-list pageBg">
		<view class="top">
			<!-- 回退到上一页-->
			<uni-icons type="back" size="30" class="back" @click="goBack()"></uni-icons>

		</view>
		<view class="path-list">
			<text class="title">收货地址</text>

			<view class="path-item" v-for="(item,index) in list" :key="index" @tap="toAddPath(index)">
				<view class="item-main">
					<view class="item-name">{{item.P_name}}</view>
					<view>{{item.p_tel}}</view>
				</view>
				<view class="item-main">
					<view class="active" v-if="item.P_isDefault">默认</view>
					<view>{{item.p_city}} {{item.p_details}}</view>
				</view>
			</view>


		</view>

		<view class="add-path">
			<view class="add-parh-btn" @tap="goAddPath">新增地址</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				list: []
			}
		},
		computed: {
			...mapState({
				GlobalUserId: state => state.m_user.GlobalUserId
			})

		},
		onLoad() {
			this.getPath()
		},
		onShow() {
			this.getPath()
		},
		methods: {
			getPath() {
				uni.request({
					url: "http://localhost:3000/getUserAddresses",
					method: 'GET',
					data: {
						userId: this.GlobalUserId // 使用前端用户 ID
					},
					success: (res) => {
						console.log('用户地址信息:', res.data.addresses);
						this.list = res.data.addresses; // 保存查询结果
						console.log(this.list);
					},
					fail: (err) => {
						console.error('查询用户地址信息失败:', err);
					}
				});
			},
			goBack() {
				uni.switchTab({
					url: '/pages/User/User Center'
				});
			},
			//修改
			toAddPath(index) {

				let pathObj = JSON.stringify({
					index: index,
					item: this.list[index]
				})
				console.log(index);
				console.log(this.list);
				uni.navigateTo({
					url: "/pages/my-add-path/my-add-path?data=" + pathObj + ""
				})
			},
			//新增
			goAddPath() {
				uni.navigateTo({
					url: "/pages/my-add-path/my-add-path"
				})
			}
		}
	}
</script>

<style>
	.top {
		width: 40px;
		/* 按钮的宽度 */
		height: 40px;
		/* 按钮的高度 */
		border-radius: 50%;
		/* 圆形按钮 */
		background-color: #9cb2ff;
		color: white;
		font-size: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
		border: none;
		outline: none;
		cursor: pointer;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
		/* 圆形阴影效果 */
		transition: box-shadow 0.3s ease;
		margin-left: 10px;
		margin-bottom: 10px;

	}

	.top:hover {
		box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.4);
		/* 鼠标悬停时阴影加深 */
	}

	.title {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 16px;
		text-align: center;
		/* 标题居中 */
	}

	.add-path {
		width: 100%;
		display: flex;
		justify-content: center;
		padding: 20rpx 0;
	}

	.add-parh-btn {
		border: 2rpx solid #49BDFB;
		color: #49BDFB;
		border-radius: 30rpx;
		padding: 6rpx 60rpx;
	}

	.path-list {
		padding-left: 20rpx;
	}

	.path-item {
		padding: 10rpx;
		border-bottom: 2rpx solid #CCCCCC;
	}

	.item-main {
		display: flex;
		align-items: center;
	}

	.item-name {
		padding-right: 10rpx;
	}

	.active {
		padding-right: 10rpx;
		background-color: #49BDFB;
		color: #FFFFFF;
		border-radius: 26rpx;
		font-size: 18rpx;
		text-align: center;
	}
</style>