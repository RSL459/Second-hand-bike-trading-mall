<template>
	<view class="register-container pageBg">
		<view class="logo-container">
			<image src="../../static/1.webp" mode="aspectFit" class="logo" />
		</view>
		<view class="form-container">
			<input v-model="userNam" type="text" placeholder="用户名" class="input-field" />
			<input v-model="passWord" type="password" placeholder="密码" class="input-field" />
			<button @click="goToLogin()" class="register-button">登录</button>
			<view class="footer">
				<text class="footer-text" @click="goToRegister">没有账号? 注册</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import request from '@/common/request.js'
	export default {
		data() {
			return {
				userNam: '',
				passWord: '',
				confirmPassWord: ''
			};
		},
		computed: {
			...mapGetters(['getUserId', 'getUserName']),
			userId() {
				return this.getUserId;
			},
			userName() {
				return this.getUserName;
			}
		},
		methods: {
			async register() {
				// 检查输入
				if (this.userNam && this.passWord && (this.passWord == this.confirmPassWord)) {
					try {
						const response = await request('/user/register', 'POST', {
							username: this.userNam,
							password: this.passWord
						});

						if (response.status == "success") {
							uni.showToast({
								title: '注册成功',
								icon: 'success'
							});
							uni.navigateTo({
								url: '/pages/login/login' // 注册成功后跳转到登录页面
							});
						} else {
							uni.showToast({
								title: response.message || '注册失败',
								icon: 'none'
							});
						}
					} catch (error) {
						console.error('注册请求失败:', error);
						uni.showToast({
							title: '注册请求失败，请重试',
							icon: 'none'
						});
					}
				} else {
					uni.showToast({
						title: '请填写完整信息并确认密码',
						icon: 'none'
					});
				}
			},
			goToRegister() {
				uni.navigateTo({
					url: "/pages/login-tel/login-tel"
				})
			},
			goToLogin() {
				uni.request({
					url: 'http://localhost:3000/user/login', // 替换为你的后端地址
					method: 'POST', // 使用 POST 方法
					data: {
						username: this.userNam,
						password: this.passWord
					},
					success: (res) => {
						console.log(res.data);
						if (res.data.status === "success") {
							this.message = '登录成功，用户ID: ' + res.data.U_userId;
							this.$store.commit('setGlobalId', res.data.U_userId); // 假设你使用的是 Vuex
							this.$store.commit('setGlobalName', res.data.U_userName);
							// 这里可以存储用户ID或其他信息到全局状态管理
							uni.switchTab({
								url: '/pages/home/home' // 替换为你的 TabBar 页面路径
							});
						} else {
							this.message = res.data.message; // 显示错误消息
							uni.showToast({
								title: "用户名或密码错误",
								icon: 'none'
							});

						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
						this.message = '请求失败';
					}
				});
			}
		}
	};
</script>

<style scoped>
	.register-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #F8F8F8;
		height: 100vh;
		/* 占满整个屏幕高度 */
		padding: 0 20px;
		/* 左右内边距 */
	}

	.logo-container {
		margin-bottom: 30px;
	}

	.logo {
		width: 80px;
		height: 80px;
		border-radius: 20rpx;
	}

	.form-container {
		width: 100%;
		max-width: 350px;
		background-color: #ffffff;
		border-radius: 10px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		padding: 20px;
	}

	.input-field {
		width: 90%;
		padding: 10px;
		margin: 10px 0;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 14px;
	}

	.register-button {
		width: 100%;
		padding: 10px;
		background-color: #007AFF;
		color: #ffffff;
		border: none;
		border-radius: 6px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.register-button:hover {
		background-color: #0056b3;
	}

	.footer {
		text-align: center;
		margin-top: 20px;
	}

	.footer-text {
		color: #007AFF;
		text-decoration: underline;
		cursor: pointer;
		font-size: 14px;
	}
</style>