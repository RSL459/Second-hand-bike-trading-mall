<template>
	<view>
		<Lines></Lines>
		<view class="login-tel">
			<view class="tel-main">
				<view class="login-from">
					<view class="login-user">
						<text class="user-text">验证码</text>
						<input type="text" focus="true" v-model="userCode" placeholder="请输入验证码" />
						<button plain="true" size="mini" :disabled="disabled" @tap="sendCode">{{codeMsg}}</button>
					</view>
				</view>
				<view class="tel" @tap="goNextIndex">下一步</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Lines from '@/components/common/Lines.vue'
	export default {
		data() {
			return {
				codeNum: 10,
				codeMsg: "",
				disabled: false,
				userCode: ""
			}
		},
		components: {
			Lines
		},
		onReady() {
			//第一次进入页面，自动开始倒计时
			this.codeMsg = '重新发送（' + this.codeNum + '）';
			this.sendCode();
		},
		methods: {
			sendCode() {
				this.disabled = true;
				//每隔一秒数字自动减1
				let timer = setInterval(() => {
					--this.codeNum;
					this.codeMsg = '重新发送（' + this.codeNum + '）';
				}, 1000);
				//倒计时结束，重置倒计时页面
				setTimeout(() => {
					clearInterval(timer);
					this.codeNum = 10;
					this.disabled = false;
					this.codeMsg = '重新发送';
				}, 10000);
			},
			goNextIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style>
	.login-tel {
		width: 100vw;
		height: 100vh;
	}

	.tel-main {
		padding: 0 20rpx;
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
	}
</style>