<template>
        <text class="keyword">{{keyword}}</text>
        <view class='shop-list'>
                <Lines />
                <CommodityList :dataList='dataList'></CommodityList>
        </view>
</template>

<script>
//import $http from '@/common/api/request.js'
import Lines from '@/components/common/Lines.vue'
import CommodityList from './CommodityList.vue'
export default {
                props:{
                        keyword:String
                },
                data() {
                        return {
                                shopList:{
                                    currentIndex:0,
                                },
                                dataList:[]
                                // dataList:[
                                //      {
                                //              id:1,
                                //              imgUrl:"../../static/img/commodity1.jpg",
                                //              name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
                                //              pprice:"299",
                                //              oprice:"659"
                                //      },
                                //      {
                                //              id:2,
                                //              imgUrl:"../../static/img/commodity2.jpg",
                                //              name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
                                //              pprice:"299",
                                //              oprice:"659"
                                //      },
                                //      {
                                //              id:3,
                                //              imgUrl:"../../static/img/commodity3.jpg",
                                //              name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
                                //              pprice:"299",
                                //              oprice:"659"
                                //      },
                                //      {
                                //              id:4,
                                //              imgUrl:"../../static/img/commodity4.jpg",
                                //              name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
                                //              pprice:"299",
                                //              oprice:"659"
                                //      }
                                // ]
                        }
                },
                computed:{
                        /*
                        orderBy(){
                                //拿到当前对象
                                let obj = this.shopList.data[this.shopList.currentIndex];
                                let val = obj.status === "1" ? "asc" : "desc" ;
                                return {
                                        [obj.key]:val
                                }

                        }*/
                },
                components:{
                        Lines,
                        CommodityList
                },
                mounted() {
                        this.getData();  // 使用 mounted 钩子调用 getData 方法
                },
                methods: {
                        //请求数据数据
                        getData() {
                                        uni.request({
                                                url: 'http://localhost:3000/goods/search', // 替换为实际的后端API URL
                                                method: 'GET',
                                                data: {
                                                    name: this.keyword
                                                },
                                                success: (res) => {
                                                    if (res.statusCode === 200) {
                                                        this.dataList = res.data; // 将请求到的数据赋值给 dataList
                                                        console.log(res.data); // 打印返回的数据
                                                    } else {
                                                        uni.showToast({
                                                            title: res.data.message || '请求失败',
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
                                            })
                }
        },
}
</script>

<style scoped>
.keyword{
        padding: 20rpx 0;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 10px;
                transition: box-shadow 0.3s;
}
.f-color{
        color:#636263;
}
.f-active-color{
        color:#49BDFB;
}
.shop-title{
        display: flex;
}
.shop-item{
        flex:1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80rpx;
}
.shop-icon{
        position: relative;
        margin-lef:10rpx;
}
.iconfont{
        width:16rpx;
        height: 8rpx;
        position: absolute;
        left:0;
}
.up{
        top:-34rpx;
}
.down{
        top:-24rpx;
}
</style>
