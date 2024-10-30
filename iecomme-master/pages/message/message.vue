<template>
	<view class="container pageBg">
		<center class="title">消息中心</center>
		<view class="message-list">
			<view v-for="(message, index) in messages" :key="index" class="message-item" @click="goToChat(message)">
				<image :src="message.avatar" class="avatar" />
				<view class="message-content">
					<text class="username">{{ message.userName }}</text>
					<br>
					<text class="message-text">{{ message.text }}</text>
				</view>
				<text class="timestamp">{{ formatTimestamp(message.timeStamp) }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messages: [{
						id: 1,
						userName: '张三',
						text: '你好，有什么需要帮助的吗？',
						avatar: '/static/avatar1.png',
						timeStamp: new Date().getTime() - 60000,
					},
					{
						id: 2,
						userName: '李四',
						text: '请查看您近期的订单。',
						avatar: '/static/avatar2.png',
						timeStamp: new Date().getTime() - 3600000,
					},
					{
						id: 3,
						userName: '王五',
						text: '您的申请已被处理。',
						avatar: '/static/avatar3.png',
						timeStamp: new Date().getTime() - 86400000,
					},
				],
			};
		},
		methods: {
			goToChat(message) {
				// 跳转到聊天页面
				uni.navigateTo({
					url: `/pages/chat/chat?id=${message.id}&username=${encodeURIComponent(message.userName)}`,
				});
			},
			//最新消息时间
			formatTimestamp(timeStamp) {
				const date = new Date(timeStamp);
				const now = new Date();
				const diff = now - date;
				if (diff < 60000) {
					return '刚刚';
				} else if (diff < 3600000) {
					return Math.floor(diff / 60000) + '分钟前';
				} else if (diff < 86400000) {
					return Math.floor(diff / 3600000) + '小时前';
				} else {
					return date.toLocaleDateString();
				}
			},
		},
	};
</script>

<style>
	.container {
		padding: 16px;
		background-color: #f5f5f5;
		height: 100vh;
	}

	.title {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 16px;
		text-align: center;
	}

	.message-list {
		background-color: #ffffff;
		border-radius: 8px;
		overflow: hidden;
		/* 防止内容溢出 */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.message-item {
		display: flex;
		align-items: center;
		padding: 12px;
		border-bottom: 1px solid #eeeeee;
	}

	.message-item:last-child {
		border-bottom: none;
		/* 最后一项去掉底部边框 */
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		margin-right: 12px;
	}

	.message-content {
		flex: 1
	}

	.username {
		font-weight: bold;
		color: #333333;
		padding-top: 2px;
	}

	.message-text {
		font-size: 10px;
		color: #666666;
		margin-top: 4px;
	}

	.timestamp {
		font-size: 12px;
		color: #999999;
	}
</style>