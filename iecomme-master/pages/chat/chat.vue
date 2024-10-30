<template>
  <view class="container pageBg">
    <text class="title">聊天</text>
    <view class="chat-window">
      <view
        v-for="(message, index) in chatMessages"
        :key="index"
        :class="['message-bubble', { 'my-message': message.userName === userName }]"
      >
        <view class="message-header" v-if="message.userName === userName">
          <image class="avatar" :src="message.avatar" />
          <text class="chat-username">{{ message.userName }}</text>
          <text class="chat-time">{{ message.time }}</text>
        </view>
        <view class="message-content">
          <text class="chat-text">{{ message.text }}</text>
        </view>
      </view>
    </view>
    <view class="input-area">
      <input
        v-model="newMessage"
        class="input"
        placeholder="输入消息..."
        @confirm="sendMessage"
      />
      <button @click="sendMessage">发送</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      newMessage: '',
      chatMessages: [],
      userName: '',
      avatar: "../static/logo.png", // 这里替换为用户头像的路径
    };
  },
  onLoad(options) {
    this.userName = decodeURIComponent(options.userName);
    this.loadChatHistory(); // 加载聊天记录（可选）
  },
  methods: {
    loadChatHistory() {
      // 根据用户名或ID加载聊天记录的逻辑
    },
    sendMessage() {
      if (this.newMessage.trim()) {
        const currentTime = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        
        this.chatMessages.push({
          userName: this.userName,
          text: this.newMessage,
          time: currentTime,
          avatar: this.avatar, // 添加用户头像
        });
        
        this.newMessage = ''; // 清空输入框
      }
    },
  },
};
</script>

<style>
.container {
  padding: 16px;
  background-color: #f5f8fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  color: #333;
}

.chat-window {
  flex-grow: 1;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 12px;
  overflow-y: auto; /* 允许滚动 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.message-bubble {
  margin-bottom: 10px;
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 75%;
  display: flex;
  flex-direction: column; /* 垂直排列 */
}

.my-message {
  background-color: #007aff;
  color: white;
  margin-left: auto; /* 右对齐 */
  text-align: right; /* 文字右对齐 */
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px; /* 头像与用户名之间的间距 */
}

.chat-username {
  font-weight: bold;
  color: #333;
  margin-right: 8px; /* 用户名与时间之间的间距 */
}

.chat-time {
  font-size: 12px;
  color: #999;
}

.message-content {
  margin-top: 4px; /* 内容与头部之间的间距 */
}

.chat-text {
  color: #ffffff;
}

.input-area {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.input {
  flex: 1;
  border: 1px solid #cccccc;
  border-radius: 20px;
  padding: 10px;
  margin-right: 8px;
}

button {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 2px 12px;
}

button:hover {
  background-color: #005bb5; /* 悬停时改变按钮颜色 */
}
</style>
