<template>
	<view class="container pageBg">
		<view class="top">
			<!-- 回退到上一页-->
			<uni-icons type="back" size="30" class="back" @click="goBack()"></uni-icons>
		</view>
		<view v-if="boughtItems.length >0">
			<text class="title">我买到的宝贝</text>
			<view v-for="(item,index) in boughtItems" :key="index" class="item">
				<!-- <navigator :url="'/pages/Product/ProductDetail?id='+item.productId"> -->
				<image :src="'../../static/products/'+item.productId+'/1.jpg'" class="item-image"
					@click="GOTO(item.productId)" />
				<text class="item-name">{{ item.title }}</text>
				<text class="item-name-detail">单价：¥{{ item.price1 }}</text>
				<text class="item-name-detail">购买数量：{{ item.number }}</text>
				<text class="item-name-detail">总价：{{ item.total }}</text>
				<!-- </navigator> -->
			</view>
		</view>
		<view v-else class="no-items">
			<image src="/static/555.jpg" class="no-items-image" />
			<text class="no-items-text">你还没有买到过宝贝</text>
			<text class="no-items-subtext">别着急，总会遇到心仪的商品</text>
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
				boughtItems: [] // 模拟已买到的宝贝列表
			};
		},
		onLoad() {
			this.fetchBoughtItems(); // 页面加载时获取已买到的宝贝
		},
		onShow() {
			this.fetchBoughtItems();
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
			fetchBoughtItems() {
				uni.request({
					url: `http://localhost:3000/buy/${this.GlobalUserId}`, // 替换为实际的后端API URL
					method: 'GET',
					success: (res) => {
						if (res.statusCode === 200) {
							this.boughtItems = res.data; // 将查询结果保存到组件的状态中
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
		background-color: #f9f9f9;
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
		height: 150px;
		/* 设置图像高度 */
		border-radius: 6px;
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
</style>