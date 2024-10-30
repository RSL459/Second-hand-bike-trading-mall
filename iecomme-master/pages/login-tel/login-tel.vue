<template>
	<view>
		<Lines></Lines>
		<view class="login-tel pageBg">
			<view class="top">
				<!-- 回退到上一页-->
				<uni-icons type="back" size="30" class="back" @click="goBack()"></uni-icons>

			</view>
			<view class="tel-main">
				<view class="login-from">
					<view class="login-user">
						<text class="user-text">用户名</text>
						<input type="text" focus="true" v-model="userName" value="" placeholder="请输入用户名" />
					</view>
				</view>
				<view class="login-from">
					<view class="login-user">
						<text class="user-text">手机号</text>
						<input type="number" focus="true" v-model="userTel" value="" placeholder="请输入11位手机号" />
					</view>
				</view>
				<view class="login-from">
					<view class="login-user">
						<text class="user-text">密码</text>
						<input type="safe-password" focus="true" v-model="userPass" value="" placeholder="请输入密码" />
					</view>
				</view>
				<view class="login-from">
					<view class="login-user">
						<text class="user-text">确认密码</text>
						<input type="safe-password" focus="true" v-model="userPassComf" value=""
							placeholder="请再输入一遍密码" />
					</view>
				</view>
				<view class="tel" @tap="goNextCode">注册</view>
				<view class="tel" @tap="goCode">短信注册	</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Lines from '@/components/common/Lines.vue'
	export default {
		data() {
			return {
				userTel: "",
				userPass: "",
				userPassComf: "",
				userName: "",
				//设定检验规则以及提示信息
				rules: {
					userTel: {
						rule: /^1[1234567890]\d{9}$/,
						msg: "请输入11位手机号"
					},
					userName: {
						rule: /\S/,
						msg: "账号不能为空"
					},
					userPass: {
						rule: /^[0-9a-zA-Z]{6,16}$/,
						msg: "密码应该为6-16位字符"
					}
				}
			}
		},
		components: {
			Lines
		},
		methods: {
			goBack() {
				uni.navigateTo({
					url: "/pages/login/register"
				})
			},
			validate(key) {
				let bool = true;
				if (!this.rules[key].rule.test(this[key])) {
					uni.showToast({
						title: this.rules[key].msg,
						icon: "none"
					})
					bool = false;
					return bool;
				}
				return bool;
			},
			goNextCode() {
				// 验证手机号
				if (!this.validate('userTel')) return;
				// 验证两次密码是否相同
				if (this.userPass !== this.userPassComf) {
					uni.showToast({
						title: "两次密码输入不相同",
						icon: "none"
					});
					return; // 结束函数，避免继续执行
				}
				uni.request({
					url: 'http://localhost:3000/addUser', // 后端接口地址
					method: 'POST',
					data: {
						U_userPhone: this.userTel,
						U_userName: this.userName,
						U_userPassword: this.userPass
					},
					success: (res) => {
						uni.showToast({
							title: '用户创建成功',
							icon: 'success'
						});
						uni.navigateTo({
							url: "/pages/login/register"
						});
					},
					fail: (error) => {
						uni.showToast({
							title: response[1].data.message || '创建用户失败',
							icon: 'none'
						});
					}
				});
			},
			goCode() {
				uni.navigateTo({
					url: '../login-code/login-code'
				})
			}
		}
	}
</script>

<style>
	.top {
		position: absolute;
		left: 5%;
		top: 5%;
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

	.login-tel {
		width: 100vw;
		height: 100vh;
		position: relative;
	}

	.tel-main {
		padding: 10px 50rpx;
		position: absolute;
		top: 10%;
		left: 6%;
	}

	.login-from {
		padding: 30rpx;
	}

	.login-user {
		font-size: 32rpx;
		padding: 10rpx 0;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #f7f7f7;
	}

	.user-text {
		padding-right: 10rpx;
	}

	.tel {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #FFFFFF;
		background-color: #49BDFB;
		border-radius: 40rpx;
		margin-bottom: 20px;
	}
</style>