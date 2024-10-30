<template>
	<view class="productDetailLayout pageBg">
		<view class="top">
			<!-- 回退到上一页-->
			<uni-icons type="back" size="30" class="back" @click="goBack()"></uni-icons>
		</view>
		<view class="container">
			<!-- 图片 -->
			<view class="banner">
				<swiper circula indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ffffff"
					autoplay>
					<swiper-item v-for="(item,index) in productImages" :key="index">
						<image class="imageitem" :src="item" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 标题 -->
			<view class="title">
				<text>{{title}}</text>
			</view>

			<view class="user">
				<image class="author-image" src="../../static/avatar3.png"></image>
				<text class="author">{{itemName}}</text>
			</view>
			<view class="price">
				<text>¥{{ productPrice }}</text>
				<text class="price_before">¥{{ price2 }}</text>
			</view>
			<!-- 库存 -->
			<text class="product_store">库存：{{store}}</text>
			<!-- 描述 -->
			<view class="description">
				<text>{{ description }}</text>
			</view>
			<!-- 按钮 -->
		</view>
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
			:direction="direction" @trigger="trigger" @fabClick="fabClick" class="buy-float-button">立即购买</uni-fab>
		<view>
			<!-- 分享示例 -->
			<uni-popup ref="share" type="share" safeArea backgroundColor="#fff">
				<!-- <uni-popup-share></uni-popup-share> -->
				<view class="info_section">
					<view class="buy_title">立即抢购</view>
					<navigator url="" class="nav" @click="getDefaultAddress()">
						<image src="../../static/position.png" class="position_image"></image>
						<view class="info">
							<text class="name">{{userName}}</text>
							<text class="phone">{{userPhone}}</text>
						</view>
						<view class="address">{{userCity}} {{userDetails}}</view>
					</navigator>
				</view>

				<view class="product_section">
					<image :src="productImages[0]" class="product_image"></image>
					<view class="product_info">
						<text class="product_title">{{title}}</text>
						<text class="product_price">¥{{productPrice}}</text>
						<view class="update-count">
							<view class="reduce" @tap="reduce(itemId)">-</view>
							<view class="cart-count">
								{{this.count}}
							</view>
							<view class="add" @tap="add(itemId)">+</view>
						</view>
					</view>
				</view>

				<view class="price_section">
					<view class="price_info">
						<text class="price_title">商品总价</text>
						<text class="total_price">¥{{sumPrice}}</text>

					</view>
				</view>

				<button class="buy_button" @click="goBuy">立即购买¥{{sumPrice}}</button>
			</uni-popup>
		</view>
		<view>
			<!-- 普通弹窗 -->
			<uni-popup class="popup_father" ref="popup" background-color="#121212" @change="change">
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }"><text
						class="text">已添加至收藏列表</text></view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				itemId: null,
				itemName: '',
				productImages: [],
				title: '',
				imageSrc: '', //替换为你的图片URL
				productPrice: null,
				price2: null,
				store: null, //商品的库存
				count: 1, //用户选中的数量
				sumPrice: null,
				userId: null, //用户id
				userDefaultAddrId: null,
				userName: '收货人', //收货人
				userPhone: '联系方式', //联系方式
				userCity: '收货地址', //收货地址
				userDetails: '详细地址',
				defaultAddress: {},
				description: '这是详情页的描述内容。可以包含多行文本和HTML标签（如果支持的话）。',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				content: [{
						iconPath: '/static/buy.png',
						selectedIconPath: '/static/buy2.png',
						text: '立即购买',
						active: false
					},
					{
						iconPath: '/static/fav1.png',
						selectedIconPath: '/static/fav2.png',
						text: '收藏',
						active: false
					}
				],
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
			};
		},
		onLoad(options) {
			const id = options.id;
			uni.request({
				url: "http://localhost:3000/getProduct/" + id,
				method: 'get',
				success: (res) => {
					console.log("123")
					console.log(res.data);

					this.itemId = res.data[0].id;
					// this.product_images=res.data.images;
					// this.itemName = res.data.name;
					this.price2 = res.data[0].price2;
					this.title = res.data[0].title;
					this.productPrice = res.data[0].price1;
					this.store = res.data[0].store;
					this.description = res.data[0].description;
					this.userId = res.data[0].userid;
					this.itemName = res.data[0].U_userName;
					this.fetchProductImages(); // 组件挂载时获取图片列表
					this.sumPrice = this.productPrice; //计算选中商品总价格

					this.getDefaultAddress();
				}
			})
			// 模拟从服务器或本地数据中获取详情
			// const detailData = this.getDetailDataById(id);



		},
		computed: {
			...mapState({
				list: state => state.m_path.list,
				GlobalUserId: state => state.m_user.GlobalUserId
			})
		},
		mounted() {

		},
		methods: {
			goBuy() {
				// 购买信息
				const purchaseData = {
					productId: this.itemId, // 产品ID
					buyId: this.GlobalUserId, // 买家ID
					sellId: this.userId, // 卖家ID
					addressId: this.userDefaultAddrId, // 用户默认收货地址ID
					unitPrice: this.productPrice, // 单价
					quantity: this.count, // 购买数量
					totalPrice: this.productPrice * this.count
				};

				// 向后端发送购买请求
				uni.request({
					url: 'http://localhost:3000/purchase', // 后端的购买接口地址
					method: 'POST',
					data: purchaseData,
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('购买成功:', res.data);
							// 处理成功的逻辑，例如跳转到订单页面或显示成功消息
						} else {
							console.error('购买失败:', res.data.message);
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
					}
				});
			},
			fetchProductImages() {
				uni.request({
					url: `http://localhost:3000/getProductImages?itemId=${this.itemId}`,
					success: (res) => {
						console.log(res.data);
						if (res.statusCode === 200) {
							this.productImages = res.data; // 将图片列表存储在 productImages 中
						} else {
							console.error('获取图片失败:', res.data.error);
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
					}
				});
			},
			//获取默认地址
			getDefaultAddress() {
				uni.request({
					url: "http://localhost:3000/getDefaultAddress",
					method: 'GET',
					data: {
						userId: this.GlobalUserId // 使用前端全局变量存储的用户ID
					},
					success: (res) => {
						if (res.statusCode === 200 && res.data.defaultAddress) {
							console.log('用户默认地址信息:', res.data.defaultAddress);
							this.defaultAddress = res.data.defaultAddress; // 将查询结果保存到页面变量中
							this.userName = this.defaultAddress.P_name
							this.userPhone = this.defaultAddress.p_tel
							this.userCity = this.defaultAddress.p_city
							this.userDetails = this.defaultAddress.p_details
							this.userDefaultAddrId = this.defaultAddress.P_id
							console.log(this.defaultAddress)
						} else {
							console.log('未找到用户默认地址');
						}
					},
					fail: (err) => {
						console.error('查询用户默认地址信息失败:', err);
					}
				});
			},

			// 增加商品数量
			add(id) {
				if (this.count < this.store) {
					this.count++

					// 商品小计价格也要改变
					this.sumPrice = this.count * this.productPrice
				} else {
					uni.showToast({
						title: '库存不足哦~',
						icon: 'none'
					})
				}
			},
			// 减少商品数量
			reduce(id) {
				if (this.count > 1) {
					this.count--
					// 商品小计价格也要改变
					this.sumPrice = this.count * this.productPrice
				} else {
					uni.showToast({
						title: '至少购买一件商品哦',
						icon: 'none'
					})
				}
			},
			trigger(e) {
				console.log(e)
				this.content[e.index].active = !e.item.active
				if (e.index == 0) {
					this.$refs.share.open()
				} else {
					// this.$refs.popup.open('center')              中央弹出自带弹窗
					uni.showToast({
						title: "收藏成功",
						icon: 'success'
					})
				}

			},
			goBack() {
				uni.navigateBack({
					delta: 1 // 返回上一页
				});
			},
			openChat() {
				// 在这里编写点击事件的处理逻辑
				// 例如，跳转到私信页面
				uni.navigateTo({
					url: '/pages/message/message' // 替换为实际的私信页面路径
				});
			},
			getDetailDataById(id) {
				// 这里应该是一个请求或者查找操作，这里用静态数据模拟
				const mockData = [{
						id: 1,
						name: 'author of Item 1',
						images: [
							'https://img.pconline.com.cn/images/upload/upc/tx/photoblog/2102/24/c4/254683435_1614163891114.jpg',
							'../../static/3.jpg'
						],
						'product_price': 299,
						'price2': 699,
						'store': 5
					},
					{
						id: 2,
						name: 'author of Item 2',
						images: ['../../static/4.jpg', '../../static/5.jpg'],
						'product_price': 299,
						'price2': 699,
						'store': 5
					},
					{
						id: 3,
						name: 'author of Item 3',
						images: ['../../static/6.jpg', '../../static/3.jpg'],
						'product_price': 299,
						'price2': 699,
						'store': 5
					}
				];
				return mockData.find(item => item.id === parseInt(id, 10));
			}
		}
	};
</script>

<style scoped lang="scss">
	.productDetailLayout {
		.top {
			position: fixed;
			/* 固定定位 */
			top: 1%;
			/* 顶部对齐 */
			left: 2%;
			/* 左侧对齐 */
			// right: 0; /* 右侧对齐 */
			z-index: 1000;
			/* 确保导航栏在其他内容之上 */
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

			.chat {
				padding: 2px 5px; //调整按钮内部空间
				width: 65px;
				font-size: 2px;
				// font-weight: 100px;
				background-color: #ffffff;
				color: #ff0000;
				margin-right: 2px;
				border: none;
				// right: 0;
				border-radius: 5px;
			}

			.back {}

		}

		.container {
			padding: 20px;
		}

		.title {
			font-size: 24px;
			font-weight: bold;
			// text-align: center;
			margin-bottom: 20px;
			margin-top: 0px;
			margin-left: 10px;

		}

		.price {
			font-size: 24px;
			font-weight: bold;
			// text-align: center;
			margin-bottom: 20px;
			margin-left: 0;
			color: firebrick;
			margin-top: 20px;
		}

		.price_before {
			text-decoration: line-through;
			text-decoration-thickness: 2px;
			/* 调整删除线的粗细，值越大越粗 */
			color: #969696;
		}
		.banner {
			width: 750rpx;
			padding: 100rpx 0;

			swiper {
				width: 670rpx;
				height: 600rpx;

				&-item {
					width: 100%;
					height: 100%;

					// padding: 0 30rpx;
					.imageitem {
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
			}
		}

		.user {
			position: relative;

			.author {
				right: 0;
				font-size: 17px;
				position: absolute;
				top: 20%;
				left: 20%;
			}

			.author-image {
				width: 40px;
				height: 40px;
				margin-left: 10px;
				margin-right: 20px;
			}
		}

		.description {
			font-size: 16px;
			line-height: 1.5;
			color: #333;
			text-align: justify;
		}

		.button-container {
			text-align: center;
			margin-top: 20px;
		}

		button {
			padding: 10px 20px;
			font-size: 16px;
			background-color: #007aff;
			color: white;
			border: none;
			border-radius: 5px;
		}

		.info_section,
		.product_section,
		.price_section {
			background-color: #ffffff;
			/* 白色背景 */
			border-radius: 10px;
			padding: 16px;
			margin-bottom: 16px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			position: relative;
		}

		.buy_title,
		.price_title {
			font-size: 18px;
			font-weight: bold;
			margin-bottom: 12px;
			color: #333;
		}

		.nav {
			position: relative;
		}

		// 居中显示
		@mixin textCenter {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.position_image {
			margin-top: 10px;
			width: 35px;
			height: 35px;
		}

		.info {
			position: absolute;
			top: 1%;
			left: 15%;
		}

		.name {
			margin-right: 10px;
		}

		.address {
			position: absolute;
			top: 60%;
			left: 15%;
		}

		.product_image {
			width: 100px;
			height: 100px;

		}

		.product_title {
			position: absolute;
			top: 10%;
			left: 40%;
		}

		.product_price {
			margin-top: 20px;
			position: absolute;
			top: 50%;
			left: 40%;
			color: #ff0000;
		}

		.total_price {
			margin-left: 195px;
		}

		.buy_button {
			background-color: #ffa83d;
			font-size: 15px;
			width: 350px;
			height: 50px;
			border-radius: 20px;
			margin-bottom: 10px;
		}

		.popup_father {
			width: 200px;
			height: 200px;
			border-radius: 15px;
		}

		.popup-content {
			color: #F1ECE7;
			font-size: 15px;
		}

		.product_store {
			color: #979797;
			font-size: 20px;
		}

		// 加减数量
		.update-count {
			position: absolute;
			left: 70%;
			top: 50%;
			margin-top: 40rpx;
			display: flex;

			.reduce {
				width: 40rpx;
				height: 40rpx;
				background: #F1ECE7;
				border-radius: 21.6rpx;
				border-radius: 21.6rpx;
				color: #979797;
				@include textCenter;
				font-size: 50rpx;
			}

			.add {
				width: 40rpx;
				height: 40rpx;
				background: #F1ECE7;
				border-radius: 21.6rpx;
				border-radius: 21.6rpx;
				color: #979797;
				@include textCenter;
				font-size: 40rpx;
			}

			.cart-count {
				width: 72rpx;
				height: 40rpx;
				background: #F1ECE7;
				border-radius: 21.6rpx;
				border-radius: 21.6rpx;
				margin-left: 18rpx;
				margin-right: 18rpx;
				text-align: center;
				line-height: 40rpx;
			}
		}

	}
</style>