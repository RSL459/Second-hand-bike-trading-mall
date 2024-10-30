<template>
	<view class="container pageBg">
		<view class="header">
			<text class="title">@{{GlobalUserName}}</text>
			<input class="search-bar" placeholder="搜索商品..." @click="goSearch()" />
		</view>
		<view class="banner">
			<!-- <image class="banner-image" src="../../static/1.webp" mode="aspectFill" /> -->
			<swiper circula indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ffffff"
				autoplay>
				<swiper-item v-for="(item,index) in firstPage" :key="index">
					<image class="imageitem" :src="item" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="product-list">
			<!-- @click="fetchProductData(product.id)" -->
			<view class="product-item" v-for="product in products" :key="product.id">
				<!-- 点击跳转到物品详情页 -->
				<navigator :url="'/pages/Product/ProductDetail?id='+product.id">
					<image class="product-image" :src="'../../static/products/'+product.id+'/1.jpg'"
						mode="aspectFill" />
					<view class="product-info">
						<view class="product-description">{{ product.title }}</view>
						<view class="product-price">¥{{product.price1}}</view>
						<view class="product-price price2">¥{{product.price2}}</view>
						<view class="product-author">
							<image class="touxiang" src="../../static/avatar1.png"></image>
							<text class="product-author-name">{{product.U_userName}}</text>

						</view>
					</view>
				</navigator>
				<uni-fav :checked="product.isFav" class="favBtn" circle="true" bgColor="#efefef"
					bgColorChecked="#ffdb6c" @click="favClick(product.id)" />
			</view>
			<view v-if="products.length === 0" class="no-products">
				<text>暂无商品</text>
			</view>
		</view>


	</view>
</template>

<script>
	import request from '@/common/request.js';
	import config from '@/common/config.js'; // 根据实际路径调整
	import {
		ref
	} from "vue";
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				products: [], // 初始化为空数组以存储从后端获取的产品
				selectedProduct: [], // 用于存储选中的产品信息
				firstPage: ['../../static/2.jpg',
					'../../static/3.jpg',
					'../../static/4.jpg',
					'../../static/5.jpg'
				]
			};
		},
		onLoad() {
			this.getAlllProduct()// 获取商品列表
		},
		onShow() {
			this.getAlllProduct()
		},
		computed: {
			// ...mapState(['GlobalUserId']) // 映射全局变量到计算属性
			...mapState({
				GlobalUserId: state => state.m_user.GlobalUserId,
				GlobalUserName: state => state.m_user.GlobalUserName,
			})
		},
		methods: {
			...mapMutations(['setGlobalId']), // 映射设置方法
			updateUserId() {
				// 设置全局变量
				this.setGlobalId(12345); // 示例用户ID
			},
			getAlllProduct() {
				uni.request({
					url: "http://localhost:3000/showAllProducts",
					data: {
						GlobalUserId: this.GlobalUserId // 将 GlobalUserId 放入请求的 body 中
					},
					method: 'post',
					success: (res) => {
						console.log(Date)
						console.log(res.data);
						this.products = res.data;
					}
				})
			},
			goSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},
			favClick(index) {
				this.$forceUpdate()
				if (!this.products[index - 1].isFav) {
					uni.request({
						url: `http://localhost:3000/favor/${this.GlobalUserId}/${index}`,
						method: 'PUT',
						success: (res) => {
							console.log(Date)
							console.log(res.data);

						}
					})
				} else {
					uni.request({
						url: `http://localhost:3000/Notfavor/${this.GlobalUserId}/${index}`,
						method: 'PUT',
						success: (res) => {
							console.log(Date)
							console.log(res.data);

						}
					})
				}

				this.products[index - 1].isFav = !this.products[index - 1].isFav
			},
			goToMyPage() {
				uni.redirectTo({
					url: '/pages/User/User Center'
				});
			},
			goToProductUpload() {
				uni.navigateTo({
					url: '/pages/Product/Product upload'
				});
			},
			async fetchUserData() {
				try {
					const response = await request('/user', 'GET');

					if (response.status === "success") {
						console.log('用户信息:', response.user);
					} else {
						uni.showToast({
							title: response.message || '获取用户信息失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: '请求失败',
						icon: 'none'
					});
					console.error(error);
				}
			},
			async fetchProducts() {
				try {
					const response = await request('/shop/products', 'GET');

					if (response && response.products) {
						this.products = response.products.map(product => ({
							id: product.id,
							title: product.name, // 显示名称
							description: product.description, // 显示描述
							price: parseFloat(product.price),
							images: product.images.map(image =>
								`http://127.0.0.1:5000/static/images/${product.id}/${image}`) // 构建完整路径
						}));
						console.log('获取到的产品:', this.products);
					} else {
						uni.showToast({
							title: '获取商品信息失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: '请求失败',
						icon: 'none'
					});
					console.error(error);
				}
			},
			async fetchProductData(productId) {
				try {
					const response = await request(`/shop/products/${productId}`, 'GET');

					if (response) {
						this.selectedProduct = {
							id: response.id,
							title: response.name,
							description: response.description, // 添加描述
							price: parseFloat(response.price),
							images: response.images.map(image =>
								`http://127.0.0.1:5000/static/images/${response.id}/${image}`) // 构建完整路径
						};
						console.log('选中产品信息:', this.selectedProduct);

						// 你可以在这里做进一步处理，例如导航到产品详情页
						uni.navigateTo({
							url: `/pages/Product/Product Details?id=${this.selectedProduct.id}`
						});
					} else {
						uni.showToast({
							title: '获取产品信息失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: '请求失败',
						icon: 'none'
					});
					console.error(error);
				}
			}

		}
	};
</script>


<style>
	/* 保留原有样式代码 */
	.container {

		padding: 16px;
		background-color: #f5f5f5;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		/* padding-bottom: px; */
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.title {
		font-size: 24px;
		font-weight: bold;
		color: #333;
	}

	.search-bar {
		width: 50%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.banner {
		width: 750rpx;
		padding: 5rpx 5rpx;
	}

	swiper {
		width: 670rpx;
		height: 300rpx;
	}

	swiper-item {
		width: 100%;
		height: 100%;
		padding: 10px 30rpx;
	}

	.imageitem {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.banner-image {
		width: 100%;
		height: 150px;
		border-radius: 10px;
		overflow: hidden;
	}

	.product-list {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.product-item {
		background-color: #fff;
		border-radius: 10px;
		margin: 8px;
		padding: 7px;
		width: calc(50% - 16px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
		position: relative;
	}

	.favBtn {
		position: absolute;
		left: 55%;
		top: 85%;
	}

	.product-item:hover {
		transform: translateY(-5px);
	}

	.product-image {
		width: 100%;
		height: 120px;
		border-radius: 5px;

	}

	.product-description {
		/* font-size: 16px;
  font-weight: bold;
  margin-top: 8px;
  color: #555; */
		margin-left: 15rpx;
		margin-right: 15rpx;
		font-size: 30rpx;
	}

	.product-price {
		display: inline-block;
		margin-left: 10px;
		font-size: 17px;

	}

	.product-price.price2 {
		/* 添加删除线 */
		text-decoration: line-through;
		text-decoration-thickness: 2px;
		/* 调整删除线的粗细，值越大越粗 */
		color: #969696;
	}

	.touxiang {
		width: 20px;
		height: 20px;

	}

	.product-author {
		color: #9d9d9d;
		/* margin-top: 4px; */
		margin: 15rpx;
		margin-top: 20rpx;
		display: flex;
		font-size: 26rpx;
		align-items: center;
		justify-content: space-between;
		position: relative;

	}

	.product-author-name {
		position: absolute;
		color: #9d9d9d;
		/* margin-top: 4px; */
		left: 20%;
	}


	.no-products {
		width: 100%;
		text-align: center;
		margin-top: 20px;
		color: #999;
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