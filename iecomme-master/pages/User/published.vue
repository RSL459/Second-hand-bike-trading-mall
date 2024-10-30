<template>
	<view class="container pageBg">
		<view class="top">
			<!-- 回退到上一页-->
			<uni-icons type="back" size="30" class="back" @click="goBack()"></uni-icons>
		</view>
		<view v-if="this.publishedItems!=null">
			<text class="title">我发布的宝贝</text>
			<view v-for="item in this.publishedItems" :key="item.id" class="item">
				<image :src="'../../static/products/'+item.id+'/1.jpg'" class="item-image" @click="GOTO(item.id)" />
				<text class="item-name">{{ item.title }}</text>
			</view>
		</view>
		<view v-else class="no-items">
			<image src="/static/555.jpg" class="no-items-image" />
			<text class="no-items-text">你还没有发布宝贝呢</text>
			<text class="no-items-subtext">别人的世界花里胡哨，你的世界空空如也~</text>
			<button class="publish-button" @click="navigateToPublish">发布宝贝</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		onBackPress() {
			uni.switchTab({
				url: "/pages/User/User Center" // 跳转到 tabBar 中的页面路径
			});
		},
		data() {
			return {
				publishedItems: [] // 模拟已发布的宝贝列表
			};
		},
		onLoad() {
			this.fetchPublishedItems(); // 页面加载时获取已发布的宝贝
		},
		onShow() {
			this.fetchPublishedItems();
		},
		computed: {
			// ...mapState(['GlobalUserId']) // 映射全局变量到计算属性
			...mapState({
				GlobalUserId: state => state.m_user.GlobalUserId,
				GlobalUserName: state => state.m_user.GlobalUserName,
			})
		},
		methods: {
			goBack() {
				uni.switchTab({
					url: '/pages/User/User Center'
				});
			},
			GOTO(id) {
				uni.navigateTo({
					url: "/pages/Product/ProductDetail?id=" + id
				})
			},
			fetchPublishedItems() {
				uni.request({
					url: `http://localhost:3000/products/${this.GlobalUserId}`, // 替换为实际的后端API URL
					method: 'GET',
					success: (res) => {
						if (res.statusCode === 200) {
							this.publishedItems = res.data; // 将查询结果保存到组件的状态中
							console.log(res.data);
						} else {
							uni.showToast({
								title: res.data.message || '获取物品失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '请求失败，请重试',
							icon: 'none'
						});
					}
				});

			},
			navigateToPublish() {
				uni.redirectTo({
					url: '/pages/Product/Product upload'
				});
			}
		}
	};
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
	}

	.top:hover {
		box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.4);
		/* 鼠标悬停时阴影加深 */
	}

	.container {
		padding: 16px;
		background-color: #ffffff;
		/* 背景颜色改为白色 */
		height: 100vh;
		display: flex;
		flex-direction: column;
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

	.item {
		background-color: #ffffff;
		/* 项目背景颜色 */
		border-radius: 8px;
		padding: 10px;
		margin-bottom: 12px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		/* 使用 Flexbox */
		flex-direction: column;
		/* 垂直排列 */
		align-items: center;
		/* 水平居中对齐 */
	}

	.item-image {
		width: 280px;
		/* 设置图像宽度 */
		height: 180px;
		/* 设置图像高度 */
		border-radius: 6px;
		margin-left: 5px;
		margin-bottom: 5px;
		/* 图像与文本之间的间距 */
	}

	.item-name {
		font-size: 18px;
		color: #333;
	}

	.item-name-detail {
		font-size: 15px;
		color: #555;
	}

	.no-items {
		text-align: center;
		margin-top: 50px;
		display: flex;
		/* 使用 Flexbox */
		flex-direction: column;
		/* 垂直排列 */
		align-items: center;
		/* 水平居中对齐 */
	}

	.no-items-image {
		width: 150px;
		height: 150px;
		margin-bottom: 10px;
		/* 图片下方间距 */
	}

	.no-items-text {
		font-size: 18px;
		color: #666;
		margin-top: 10px;
	}

	.no-items-subtext {
		font-size: 14px;
		color: #999;
		margin-top: 5px;
	}

	.publish-button {
		margin-top: 20px;
		padding: 10px 20px;
		background-color: #007bff;
		/* 按钮背景颜色 */
		color: white;
		/* 按钮文字颜色 */
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
	}

	.publish-button:hover {
		background-color: #0056b3;
		/* 悬停时按钮颜色 */
	}
</style>