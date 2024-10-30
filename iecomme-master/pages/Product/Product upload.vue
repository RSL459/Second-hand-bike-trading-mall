<template>
	<view class="container pageBg">
		<form @submit.prevent="submitProduct">
			<view class="form-group">
				<label for="name">商品名称(笔记标题):</label>
				<input v-model="productName" type="text" id="name" required class="input-field" />
			</view>
			<view class="form-group">
				<label for="description">商品描述(正文部分):</label>
				<textarea v-model="productDescription" id="description" required class="textarea-field"></textarea>
			</view>
			<view class="form-group">
				<label for="description">商品库存:</label>
				<textarea v-model="productStock" id="description" required class="textprice-field"></textarea>
			</view>
			<view class="form-group">
				<label for="description">商品原价:</label>
				<textarea v-model="productPrice" id="description" required class="textprice-field"></textarea>
			</view>
			<view class="form-group">
				<label for="description">商品二手价:</label>
				<textarea v-model="productPrice2" id="description" required class="textprice-field"></textarea>
			</view>
			<view class="form-group">
				<button @click="chooseImage" class="image-button" type="button"></button>
				<view class="image-preview">
					<image v-for="(img, index) in selectedImages" :key="index" :src="img" mode="aspectFill"
						class="image-item" />
				</view>
			</view>
			<button type="button" @click="submitProduct" class="submit-button">提交商品</button>
		</form>
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
				productName: '',
				productDescription: '',
				productPrice: '',
				productPrice2: '',
				productStock: '',
				selectedImages: []
			};
		},
		computed: {
			// ...mapState(['GlobalUserId']) // 映射全局变量到计算属性
			...mapState({
				GlobalUserId: state => state.m_user.GlobalUserId,
				GlobalUserName: state => state.m_user.GlobalUserName,
			})
		},
		methods: {
			chooseImage() {
				uni.chooseImage({
					count: 5 - this.selectedImages.length,
					success: (res) => {
						this.selectedImages = this.selectedImages.concat(res.tempFilePaths);
						console.log(res.tempFilePaths);
					},
					// 将选中的 Blob URL 转换为文件并添加到 FormData

				});
			},
			submitProduct() {
				// 假设你在某个页面的 methods 中添加这个方法
				const productData = {
					title: this.productName, // 从你的数据模型中获取
					description: this.productDescription,
					store: this.productStock,
					price1: this.productPrice,
					price2: this.productPrice2,
					userid: this.GlobalUserId,
					selectedImages: this.selectedImages
				};

				uni.request({
					url: 'http://localhost:3000/add', // 替换成你的后端地址
					method: 'POST',
					header: {
						'Content-Type': 'application/json' // 确保请求头为 JSON
					},
					data: productData,
					success: (res) => {
						if (res.statusCode === 200) {
							console.log(res.data.productId);
							uni.showToast({
								title: '增加数据成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: '新增数据失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.showToast({
							title: '请求失败',
							icon: 'none'
						});
					}
				});

				uni.switchTab({
					url: "/pages/home/home"
				})

			},


			async saveBlobAsJpg(blobUrl, index) {
				try {
					// Fetch the Blob data
					const response = await fetch(blobUrl);

					// Check if the response is okay
					if (!response.ok) {
						throw new Error(`Failed to fetch Blob URL: ${response.statusText}`);
					}

					// Get the Blob data as a buffer
					const buffer = await response.buffer();

					// Define the file path (using index to create unique file names)
					const filePath = path.join(__dirname, '', `image_${index}.jpg`);

					// Ensure the output directory exists
					fs.mkdirSync(path.dirname(filePath), {
						recursive: true
					});

					// Write the buffer to a file
					fs.writeFileSync(filePath, buffer);

					console.log(`File saved at ${filePath}`);
				} catch (error) {
					console.error('Error saving file:', error);
				}
			},

			// Loop through each Blob URL and save it
			async saveAllBlobs(blobUrls) {
				for (let i = 0; i < blobUrls.length; i++) {
					await saveBlobAsJpg(blobUrls[i], i);
				}
			},
			resetForm() {
				this.productName = '';
				this.productDescription = '';
				this.productPrice = '';
				this.productStock = '';
				this.selectedImages = [];
			}
		}
	};
</script>

<style scoped>
	.container {
		padding: 20px;
		background-color: #f7f9fc;
		/* 背景色 */
	}

	.form-group {
		margin-bottom: 15px;
		margin-right: 40px;
	}

	.input-field,
	.textarea-field {
		margin-top: 10px;
		width: 100%;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 5px;
		transition: border-color 0.3s;
	}

	.input-field:focus,
	.textarea-field:focus {
		border-color: #313131;
		/* 聚焦时边框颜色 */
	}

	.textarea-field {
		height: 50px;
		/* 文本域高度 */
		resize: none;
		/* 禁止调整大小 */
	}

	.textprice-field {
		height: 30px;
		/* 文本域高度 */
		resize: none;
		/* 禁止调整大小 */
		margin-top: 10px;
		width: 100%;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 5px;
		transition: border-color 0.3s;
	}

	.image-button {
		/* background-color: #007aff; /* 按钮背景色 */
		background-image: url('~@/static/selectPic.png');
		/* 引用图片路径 */
		background-size: cover;
		/* 使图片覆盖整个按钮 */
		background-repeat: no-repeat;
		/* 防止图片重复 */
		border: none;
		/* 去掉按钮边框 */
		outline: none;
		/* 去掉按钮点击时的轮廓线 */
		cursor: pointer;
		/* 添加鼠标悬停效果 */

		/* color: #fff; /* 按钮文字颜色 */
		border: none;
		margin-left: 0;
		padding: 5px 10px;
		border-radius: 5px;
		transition: background-color 0.3s;
		width: 100px;
		height: 100px;
	}

	.image-button:hover {
		background-color: #cccaff;
		/* 悬停时更改颜色 */
	}

	.image-preview {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10px;
	}

	.image-item {
		width: 100px;
		height: 100px;
		margin-right: 10px;
		border-radius: 10px;
		/* 图片圆角 */
	}

	.submit-button {
		background-color: #cbd1ff;
		/* 提交按钮颜色 */
		color: #ffffff;
		/* 提交按钮文字颜色 */
		border: none;
		padding: 10px 20px;
		border-radius: 25px;
		cursor: pointer;
		width: 200px;
		height: 50px;
		margin-top: 50px;
		margin-bottom: 50px;
		font-size: 18px;
		transition: background-color 0.3s;
	}

	.submit-button:hover {
		background-color: #9f9cff;
		/* 提交按钮悬停颜色 */
	}
</style>