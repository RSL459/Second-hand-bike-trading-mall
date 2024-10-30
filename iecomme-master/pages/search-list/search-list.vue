<template>
	<view>
		<ShopList :keyword="keyword"></ShopList>
	</view>
</template>

<script>
	import ShopList from '@/components/common/ShopList.vue'
	export default {
		data() {
			return {
				keyword: ""
			}
		},
		components: {
			ShopList
		},
		onLoad(e) {
			//console.log(e.keyword);
			this.keyword = e.keyword;
			// #ifdef APP-PLUS
			var webView = this.$mp.page.$getAppWebview();
			webView.setTitleNViewSearchInputText(e.keyword)
			// #endif
		},
		methods: {

		}
	}
</script>

<style>

</style>