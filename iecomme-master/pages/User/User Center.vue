<template>
	<view class="container pageBg">
		<view class="header">
			<text class="title">iEComme</text>
			<text class="username">{{ GlobalUserName }}</text>
			<image src="../../static/avatar2.png" class="avatar" />
		</view>

		<view class="content">
			<!-- 我的订单相关板块 -->
			<view class="cart-section">
				<text class="cart-title">我的订单</text>
				<text class="all-title">
					全部订单
					<uni-icons type="right" size="15" color="#aaa"></uni-icons>
				</text>

				<scroll-view scroll-x>
					<view class="box">
						<image src="../../static/send.png" mode="aspectFill"></image>
						<br>
						<text class="text-title">待发货</text>
					</view>
					<view class="box">
						<image src="../../static/receive.png" mode="aspectFill"></image>
						<br>
						<text class="text-title">待收货</text>
					</view>
					<view class="box">
						<image src="../../static/comment.png" mode="aspectFill"></image>
						<br>
						<text class="text-title">待评价</text>
					</view>
					<view class="box" @click="goAddress()">
						<image src="../../static/address.png" mode="aspectFill"></image>
						<br>
						<text class="text-title">地址管理</text>
					</view>
				</scroll-view>
			</view>
			<!-- 个人信息板块 -->
			<view class="info-section">
				<text class="info-title">个人信息</text>

				<view class="info-item" @click="goToHelp">
					<uni-icons class="icon" type="help" size="28" color="#e7cae9"></uni-icons>
					<text>帮助与客服</text>
					<uni-icons class="right" type="right" size="15" color="#aaa"></uni-icons>
				</view>

				<view class="info-item" @click="goToSettings">
					<uni-icons class="icon" type="gear" size="28" color="#a7b7e9"></uni-icons>
					<text>设置</text>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</view>
			</view>

			<!-- 我的交易板块 -->
			<view class="trade-section">
				<text class="trade-title">我的交易</text>
				<view class="trade-item" @click="goToPublished">
					<uni-icons class="icon" type="cloud-upload" size="28" color="#dbb8e9"></uni-icons>
					<text>我发布的</text>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</view>
				<view class="trade-item" @click="goToSold">
					<uni-icons class="icon" type="wallet" size="28" color="#bcb4e9"></uni-icons>
					<text>我卖出的</text>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</view>
				<view class="trade-item" @click="goToBought">
					<uni-icons class="icon" type="cart" size="28" color="#87bce9"></uni-icons>
					<text>我买到的</text>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</view>
			</view>
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
				userName: '很长很长的名字',
				email: 'zhangsan@example.com',
				phone: '1234567890'
			};
		},
		computed: {
			// ...mapState(['GlobalUserId']) // 映射全局变量到计算属性
			...mapState({
				GlobalUserId: state => state.m_user.GlobalUserId,
				GlobalUserName: state => state.m_user.GlobalUserName,
			})
		},
		methods: {
			goAddress() {
				uni.navigateTo({
					url: '/pages/my-path-list/my-path-list' // 请替换为帮助页面路径
				});
			},
			goToHome() {
				uni.redirectTo({
					url: '/pages/home/home'
				});
			},
			goToHelp() {
				uni.navigateTo({
					url: '/pages/help/help' // 请替换为帮助页面路径
				});
			},
			goToSettings() {
				uni.navigateTo({
					url: '/pages/settings/settings' // 请替换为设置页面路径
				});
			},
			goToPublished() {
				uni.navigateTo({
					url: '/pages/User/published' // 请替换为我发布的页面路径
				});
			},
			goToSold() {
				uni.navigateTo({
					url: '/pages/User/sold' // 请替换为我卖出的页面路径
				});
			},
			goToProductUpload() {
				uni.navigateTo({
					url: '/pages/Product/Product upload'
				});
			},
			goToBought() {
				uni.navigateTo({
					url: '/pages/User/bought' // 请替换为我买到的页面路径
				});
			},
			goToMessages() {
				uni.navigateTo({
					url: '/pages/User/message' // 请替换为消息页面路径
				});
			}
		}
	};
</script>

<style>
	.container {
		padding: 16px;
		background-color: #e5f4fa;
		/* 淡蓝色背景 */
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		background-color: #bccbff;
		padding: 10px;
		border-radius: 8px;
		/* color: white; */
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		margin-right: 2px;

	}

	.title {
		font-size: 24px;
		font-weight: bold;
		color: #f9d3ff;
	}

	.username {
		font-size: 14px;
		color: #5e5e5e;
	}

	.content {
		flex: 1;
	}

	.icon {
		margin-bottom: 12px;
	}

	.all-title {
		color: #676767;
		font-size: 12px;
		display: grid;
		place-items: end;
	}

	scroll-view {
		white-space: nowrap;
		width: 300px;
		height: 70px;
	}

	.box {
		width: 155rpx;
		height: 150rpx;
		display: inline-block;
		/* margin-right: 2rpx; */
		margin-top: 30rpx;
		margin-left: 10rpx;
	}

	image {
		width: 29%;
		height: 29%;
		border-radius: 5rpx;
		padding-left: 7px;
	}

	.box:last-child {
		margin-right: 10rpx;
	}

	.text-title {
		font-size: 12px;
	}

	.cart-section,
	.info-section,
	.trade-section,
	.message-section {
		background-color: #ffffff;
		/* 白色背景 */
		border-radius: 10px;
		padding: 16px;
		margin-bottom: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.cart-title,
	.info-title,
	.trade-title,
	.message-title {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 12px;
		color: #333;
	}

	.right {
		/* 使元素靠右对齐 */
		display: grid;
		place-content: end;
	}

	.info-item,
	.trade-item,
	.message-item {
		padding: 12px 0;
		border-bottom: 1px solid #f0f0f0;
		/* 浅灰色分隔线 */
		color: #676767;
		transition: background-color 0.3s;
		padding-bottom: 2px;
	}

	.info-item:last-child,
	.trade-item:last-child,
	.message-item:last-child {
		border-bottom: none;
	}

	.info-item:hover,
	.trade-item:hover,
	.message-item:hover {
		background-color: #f0f8ff;
		/* 浅蓝色悬停效果 */
	}

	.footer {
		display: flex;
		justify-content: space-around;
		padding: 10px 0;
		border-top: 1px solid #ddd;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.footer-item {
		font-size: 16px;
		color: #333;
	}

	.sell-button {
		width: 50px;
		height: 50px;
		background-color: #ff4500;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		top: -20px;
		/* 向上移动 */
	}

	.sell-button-text {
		color: white;
		font-size: 14px;
		text-align: center;
		line-height: 50px;
		/* 垂直居中 */
	}
</style>