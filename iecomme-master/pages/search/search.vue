<template>
	<view class="search pageBg">
		<Lines></Lines>
		<view class="search-item">
			<view class="search-title">
				<view class="f-color">最近搜索</view>
				<view class="iconfont icon-iconset0213" @tap="clearHistory"></view>
			</view>
			<view v-if="searchData.length>0">
				<view class="search-name f-color" v-for="(item,index) in searchData" :key="index"
					@tap="setKeyword(item)">{{item}}</view>
			</view>
			<view v-else class="search-end f-color">暂无搜索记录</view>
		</view>

		<view class="search-item">
			<view class="search-title">
				<view class="f-color">热门搜索</view>
			</view>
			<view>
				<view class="search-name f-color" @tap="setKeyword('山地')">山地</view>
				<view class="search-name f-color" @tap="setKeyword('二手')">二手</view>
				<view class="search-name f-color" @tap="setKeyword('95新')">95新</view>
				<view class="search-name f-color" @tap="setKeyword('车把手')">车把手</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';

	import Lines from '@/components/common/Lines.vue'
	export default {
		data() {
			return {
				keyword: '',
				searchData: []
			}
		},
		components: {
			Lines
		},
		computed: {
			// ...mapState(['GlobalUserId']) // 映射全局变量到计算属性
			...mapState({
				GlobalUserId: state => state.m_user.GlobalUserId,
				GlobalUserName: state => state.m_user.GlobalUserName,
			})
		},
		onNavigationBarButtonTap(e) {
			if (e.float == 'right') {
				this.search();
			}
		},
		onNavigationBarSearchInputChanged(e) {
			this.keyword = e.text;
			console.log(e);
		},
		onNavigationBarSearchInputConfirmed() {
			this.search();
		},
		onLoad() {
			uni.getStorage({
					key: "searchData",
					success: (res) => {
						console.log(res);
						this.searchData = JSON.parse(res.data);
					}
				}),
				this.getList()
		},
		methods: {
			setKeyword(keyword) {
				this.keyword = keyword; // 假设你有一个 data 属性 keyword 用于存储当前搜索框的内容
				this.performSearch(keyword); // 自动触发搜索
			},
			performSearch(keyword) {
				// 跳转到搜索页面，并传递关键字作为参数
				uni.navigateTo({
					url: "../search-list/search-list?keyword=" + this.keyword + ""
				});
			},
			search() {
				if (this.keyword == "") {
					return uni.showToast({
						title: "关键词不能为空",
						icon: "none"
					})
				} else {
					this.addSearch();
					uni.navigateTo({
						url: "../search-list/search-list?keyword=" + this.keyword + ""
					})
				}
				uni.hideKeyboard();
			},
			addSearch() {
				let idx = this.searchData.indexOf(this.keyword);
				if (idx < 0) {
					this.searchData.unshift(this.keyword);
				} else {
					this.searchData.unshift(this.searchData.splice(idx, 1)[0]);
				}
				uni.setStorage({
					key: "searchData",
					data: JSON.stringify(this.searchData)
				})
				// 向后端发送请求以保存搜索历史
				uni.request({
					url: 'http://localhost:3000/addSearchHistory', // 替换为实际的后端 API URL
					method: 'POST',
					data: {
						userId: this.GlobalUserId, // 用户 ID
						history: this.keyword // 搜索关键字
					},
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('搜索历史添加成功');
						} else {
							uni.showToast({
								title: res.data.message || '添加搜索历史失败',
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
				console.log(this.keyword);
			},
			clearHistory() {
				uni.showModal({
					title: "重要提示",
					content: "是否要清除搜索记录",
					cancelText: "取消",
					confirmText: "确定",
					success: (res) => {
						console.log(res);
						if (res.confirm) {
							// 向后端发送请求以删除用户的搜索记录
							uni.request({
								url: 'http://localhost:3000/clearSearchHistory', // 替换为实际的后端 API URL
								method: 'DELETE',
								data: {
									userId: this.GlobalUserId // 用户 ID
								},
								success: (res) => {
									if (res.statusCode === 200) {
										uni.removeStorage({
											key: "searchData"
										});
										this.searchData = []; // 清空本地搜索记录
										uni.showToast({
											title: '搜索记录已清除',
											icon: 'success'
										});
									} else {
										uni.showToast({
											title: res.data.message || '清除记录失败',
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

							uni.removeStorage({
								key: "searchData"
							})
							this.searchData = [];
						}
					}
				})
			},
			getList() {
				uni.request({
					url: 'http://localhost:3000/getSearchHistory', // 替换为实际的后端 API URL
					method: 'GET',
					data: {
						userId: this.GlobalUserId // 用户 ID
					},
					success: (res) => {
						console.log(res.data);
						if (res.statusCode === 200) {
							// 处理返回的历史记录
							console.log('匹配的历史记录:', res.data.history);
							this.searchData = res.data.history;
						} else {
							uni.showToast({
								title: res.data.message || '获取历史记录失败',
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
	}
</script>

<style>
	.f-color {
		color: #636263;
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	@font-face {
		font-family: "iconfont";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAWIAAsAAAAACswAAAU7AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDVgqIEIZcATYCJAMcCxAABCAFhG0HcRs9CciemjwpkVoTIpDgvdL+gvJjERRrZc/yA4MMSECwUcwSuHzKR0gunwiV8uzY5f4eN300E5qa0U7IzCriE5E0/REsXAhlc9gcNq8rdK5+7giS7qJLz9qypIhfanlyIm2JNA8scMIBBQQBpUlAfLHv4Fjqp/+D5fmHS1fgZqMEGlBFCpbgRHEGo7NrUuJ71ukE6g3rTbI2fcAIkMowcSDvBMeQIM00shZ8qORFza6ZeAq5Krln9xHAE/v78QOCQ0oiT7Ez7Tyelg2Jn92eXezO/8LR1Ah39mfCcC9SLAIZcavWcgXmI4sw9fOrtLAVaFRJZJ/dn/Ez90yelf0H7Lk5E7BYaNTM/8EjlUkUQk4UIGnsYQ9GCz6TVEnnUguVDFKGSgKpA2ddqUAlIL2okINS79KMLhBrAOIFMMWSYx2hEEIib5rtwZ2aJjN7pLR3uMhaXd1TnLYUSI6Y8s25cPBO3mS8vmfxufArIdfT7F28y7xDVrtHhtc//d04VrY3zGn7fvlkk+RuflZBQUnD9jovr7ytDg8abNuPNnkVeTmWcIWNnR3rrX6TXNg9onNEJsIT9GHEoaQZ+Xjr/nzFokwadGjYNzFPL9byoMCUjzfvV5sk/g/4jC8YoxnnIm65YLxouWy6NCLfarJZmoyNVMll9h6VP3N5jRxdMHd5jsjVUaZ2ma0mH3yy18i8osJcw7WlI67MHXn1YRuZMOr6rb7hSuYJc79T19ImU8jm6/1PW/qevBo3Gilz+AjJtWv1+vV29Wq5cmUIUXauEaO3OhSZlapZdzDWTie2jXbLzOmJW/GRGlo9zaPp5i1NXfx73fAb+sOG5QdoHXMift+iX0fjZP8KZ/59yv5AI7F/OJ4Q1L96K1/zNmUQkSFTrXdpa7F26mn82v35nR0fjh8xrkbXjKBu1u6ec/Yt0WdpVw7eLD2Q9pS7uQnE/yy3o8foep9ToMHvet3Fce3XZ4HsE/TPTh7RPICyA3UfZOPn+y3WjpUk7Hg1PjgQMvmXOl19kCJPlYfKQ1ZMKxM/hIyEEkvD7wZd+c8iXzffxS/ZqsdX4nv5P4vhv2vjMknWQbbk/xvhYrXI/qApL+HtNwgRAicYIqgFdQ+pAdlsHTdBBmmPdfIKknx5fR//SQkVMxfMKif8PL7rLw9bPmsB1KjptHXcxtTAwRbYk+Y+PPIwztQalRtNC3LtCqvfggE7Zqf0AN2F9MJeAyZn6kjqr8CX3THJYfBLwy2AmhVbiY2yKxdg/9IFQNofT8hZRpKBALUraTO2CEifYqN/59VsGp35e7JL7B+p+YlP+yQz21FPraCF/UQrCWtz/7zcNYeyBZ9py2zWWXLWJJfOaPWFBPXq8ad1tLu3P1nX2rmESleERGkIUpVJZIZdhFyDJVCorIB6CzL2btBBgImsDvMWEAit1kOi2XtItTqLzLB3IdftLRRaA4N6+8PjkA2mg8NTBESKKJvImkZwFK+hhV7EXf4wxOhVpJDyLWEUEnScnwjyDyzGM5AGCfvYQpfDBIsiTdACrybSydmQSsUTWoFXIEr0Z0VRGx0QQNe9kD/FqwG3hgAhiZBshCzTEDgUngatpxbhpZ8fBmHoqZCElrZzxlEQgQ63cEIQf4FrIDMkmrXansvSOjkYwUQiurcWTcBTI6TDhKh4hEfQ1q+kgFBE/tgtQlrRAug4el2J//Fl6td5HtRj25eRRBpZ5FFEGZWGu384HRIDg4NCpAyvN+gpFuFTOVIh1tCIvN5Rx5IaJlnKXk0yGo7mkNCqVchLNQAA') format('woff2');
	}

	.icon-iconset0213:before {
		content: "\e670";
	}

	.search-item {
		padding: 20rpx;
	}

	.search-title {
		display: flex;
		justify-content: space-between;
	}

	.search-name {
		padding: 4rpx 24rpx;
		background-color: #E1E1E1;
		display: inline-block;
		border-radius: 26rpx;
		margin: 10rpx;
	}

	.search-end {
		text-align: center;
	}
</style>