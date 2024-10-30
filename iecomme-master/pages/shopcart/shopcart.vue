<template>
	<view class='shop-cart pageBg'>

		<template v-if='        list.length>0'>
			<!--自定义导航栏-->
			<uniNavBar title='收藏夹' :right-text='  isNavBar?"完成":"编辑"   ' fixed='true' status-bar='true'
				@clickRight='  isNavBar = !isNavBar  '></uniNavBar>

			<!--商品内容-->
			<template v-if="!isNavBar">
				<view class='shop-list'>
					<view class='shop-item' v-for='(item,index) in list' :key='index'>
						<image class='shop-img' :src="'../../static/products/'+item.id+'/1.jpg'" mode=""
							@click="goDetails(item.id)"></image>
						<view class='shop-text'>
							<view class='shop-name'>{{item.title}}</view>
							<view class='shop-color f-color'>{{item.description}} </view>
						</view>
					</view>
				</view>
			</template>
			<template v-else>
				<view class='shop-list'>
					<view class='shop-item' v-for='(item,index) in list' :key='index'>
						<label class="radio" @click='selectedItem(index)'>
							<radio :value="item.id" color="#FF3333" :checked="selectedlist.includes(item.id)" />
							<text></text>
						</label>
						<image class='shop-img' :src="'../../static/products/'+item.id+'/1.jpg'" mode=""></image>
						<view class='shop-text'>
							<view class='shop-name'>{{item.title}}</view>
							<view class='shop-color f-color'>{{item.description}} </view>
						</view>
					</view>
				</view>

				<!--底部-->
				<view class='shop-list'>
					<view class='foot-total'>
						<view class='foot-num' @click="delgoods">删除</view>
					</view>
				</view>

			</template>
		</template>
		<template v-else>
			<uniNavBar title='购物车' status-bar="true" fixed="true"></uniNavBar>
			<view class="shop-else-list">
				<text>购物车还是空的</text>
			</view>
		</template>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni/uni-nav-bar/uni-nav-bar.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				isNavBar: false,
				selectedlist: [],
				list: []
			}
		},
		computed: {
			// ...mapState(['GlobalUserId']) // 映射全局变量到计算属性
			...mapState({
				GlobalUserId: state => state.m_user.GlobalUserId,
				GlobalUserName: state => state.m_user.GlobalUserName,
			})
		},
		onLoad() {
			this.getFavList()
		},
		onShow() {
			this.getFavList()
		},
		components: {
			uniNavBar
		},
		methods: {
			//进入商品详情页
			goDetails(index) {
				uni.navigateTo({
					url: "/pages/Product/ProductDetail?id=" + index
				})
			},
			getFavList() {
				uni.request({
					url: "http://localhost:3000/favor/" + this.GlobalUserId,
					method: 'get',
					success: (res) => {
						console.log(Date)
						console.log(res.data);
						this.list = res.data;
						console.log('获取的商品列表:', this.list);

					}
				})
			},
			selectedItem(index) {
				let id = this.list[index].id;
				//console.log(id);
				let i = this.selectedlist.indexOf(id);
				if (i > -1) {
					return;
				}
				this.list[index].checked = true;
				this.selectedlist.push(id);
				console.log(this.selectedlist);
			},


			delgoods() {
				if (this.selectedlist.length === 0) {
					uni.showToast({
						title: '未选择任何商品',
						icon: 'none'
					});
					console.log('当前选中的商品 ID:', this.selectedlist);
					return;
				}

				// 获取 GlobalUserId
				const globalUserId = this.GlobalUserId;

				// 发起删除请求
				uni.request({
					url: 'http://localhost:3000/deleteFav', // 后端 API 的 URL
					method: 'POST',
					data: {
						listId: this.selectedlist, // 发送选中的商品 ID 列表
						globalUserId: globalUserId // 发送 GlobalUserId
					},
					success: (res) => {
						if (res.data.success) {
							// 过滤掉被选中的商品
							this.list = this.list.filter(item => !this.selectedlist.includes(item.id));
							// 清空已选列表
							this.selectedlist = [];
							uni.showToast({
								title: '删除成功',
								icon: 'none'
							});
							console.log('删除后的商品列表:', this.list);
						} else {
							uni.showToast({
								title: '删除失败，请重试',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '请求失败',
							icon: 'none'
						});
						console.error('删除请求失败:', err);
					}
				});
			}
		}
	}
</script>

<style scoped>
	.shop-list {
		padding-bottom: 100rpx;
	}

	.shop-else-list {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #F7F7F7;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.shop-item {
		display: flex;
		padding: 20rpx;
		align-items: center;
		background-color: #F7F7F7;
		margin-bottom: 10rpx;
	}

	.shop-img {

		width: 35%;
		height: 85px;
		border-radius: 5px;
	}

	.shop-text {
		flex: 1;
		padding-left: 20rpx;
	}

	.shop-color {
		font-size: 24rpx;
		display: -webkit-box;
		/* 对于 WebKit 浏览器（如 Safari） */
		-webkit-box-orient: vertical;
		/* 垂直排列 */
		-webkit-line-clamp: 3;
		/* 限制为两行 */
		overflow: hidden;
		/* 隐藏超出部分 */
		text-overflow: ellipsis;
		/* 显示省略号 */
		line-height: 1.5;
		/* 行高 */
		max-height: 4.5em;
		/* 最大高度为两行的高度 */
	}

	.shop-price {
		display: flex;
		justify-content: space-between;
	}

	.shop-foot {
		border-top: 2rpx solid #F7F7F7;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 200rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.foot-radio {
		padding-left: 20rpx;
	}

	.foot-total {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.foot-count {
		line-height: 100rpx;
		padding: 0 20rpx;
		font-size: 32rpx;
	}

	.foot-num {
		background-color: #b8c2fb;
		color: #FFFFFF;
		padding: 0 60rpx;
		border-radius: 10px;
		line-height: 100rpx;

	}
</style>