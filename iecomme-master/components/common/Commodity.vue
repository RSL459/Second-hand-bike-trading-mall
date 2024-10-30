<template>
        <view class='commodity' :style="'flex-wrap:' +wrap+';'">
                <!-- 单个商品组件 -->

                <view class='commodity-item'
                        v-for="(item,index) in dataList"
                        :key='index'
                        :style="'width:'+itemW+';'"
                >
                        <image
                        class='commodity-img'
                        :src="'../../static/products/'+item.id+'/1.jpg'"
                         mode=""
                         :style="'height:'+bigH+';'"  @click="goDetails(item.id)"
                        ></image>

                        <view class='commodity-content'>
                                <text class='commodity-name' :style="'font-size:'+nameSize+';'">{{item.title}}</text>
                                <view>
                                        <text class='pprice'>¥{{item.price1}}</text>
                                        <text class='oprice'>¥{{item.price2}}</text>
                                </view>
                        </view>
                </view>

        </view>
</template>

<script>
export default {
        props:{
                // 数据
                dataList:Array,
                //宽度
                itemW:{
                        type:String,
                        default:"375rpx"
                },
                //高度
                bigH:{
                        type:String,
                        default:"375rpx"
                },
                //是否换行
                wrap:{
                        type:String,
                        default:"wrap"
                },
                //商品文字大小
                nameSize:{
                        type:String,
                        default:"26rpx"
                }
        },
        methods:{
                goDetails(id){
                        uni.navigateTo({
                                url:`/pages/Product/ProductDetail?id=${id}`
                        })
                }
        }
}
</script>

<style scoped>
.commodity{
        display: flex;
}
.commodity-item{
        padding-bottom:20rpx;
        padding: 5px;

}
.commodity-img{
        width:100%;
        height: ;
        border-radius: 10px;
}
.commodity-content{
        text-align: center;
}
.commodity-name{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
        color:#333333;
        word-break: break-all;
        padding:6rpx 20rpx;
}
.oprice{
        text-decoration: line-through;
        font-size:24rpx;
        color:#999999;
}
.discount{
        border-radius: 4rpx;
        border:1px solid #FF3333;
        padding:2rpx 10rpx;
        font-size:20rpx;
        color:#FF3333;
}
</style>
