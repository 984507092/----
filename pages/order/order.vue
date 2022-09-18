<template>
	<view class="">
		<view class="order_tit">
			<scroll-view scroll-x="true" class="scroll">
				<text :class="status===0?'act':'hide'" @click="allStatus">全部</text>
				<text :class="status===1?'act':'hide'" @click="obligation">待付款</text>
				<text :class="status===2?'act':'hide'" @click="dropShipping">待发货</text>
				<text :class="status===3?'act':'hide'" @click="receiving">待收货</text>
				<text :class="(status===7||status===6)?'act':'hide'" @click="completed">已完成</text>
				<!-- <text :class="[(params.status == 5||params.status == 4)?'act':'']" data-index="5">售后</text> -->
			</scroll-view>
		</view>

		<view class="order_box" v-for="(item,index) in orderList">
			<view class="order_list">
				<view class="order_top">
					<text class="order_pa">订单号：{{item.order_sn}}</text>
					<text class="order_pb" v-if="item.status==1">待付款</text>
					<text class="order_pb" v-if="item.status==2">待发货</text>
					<text class="order_pb" v-if="item.status==3">待收货</text>
					<text class="order_pb" v-if="item.status==6||item.status==7">已完成</text>
					<text class="order_pb" v-if="item.status==8">已取消</text>
				</view>
				<view class="order_center" v-for="item2 in item.goods">
					<image :src="item2.img"></image>
					<view class="order_good">
						<view class="order_pc">{{item2.name}}</view>
						<view class="order_pd">{{item2.attr}}</view>
						<view class="order_pe">
							<text class="price">¥{{item2.price}}</text>
							<text>x{{item2.num}}</text>
						</view>
					</view>
				</view>
				<view class="order_fee">
					<!-- <text class="order_pf">14:00</text> -->
					<text class="order_pg">
						共 1件商品 实付款
						<text style="color: #FDD100;font-size: 34rpx;margin-left: 5px;">¥{{item.all_amount}}</text>
					</text>
				</view>

				<template>
					<view class="order_bottom">
						<!-- <text data-type="del"  >删除订单</text> -->
						<text data-type="detail"  @click="navTo(`/pages/order/order_detail?orderId=${item._id}`)">查看详情</text>
						<text data-type="pay"  class="act"  @click="navTo(`/pages/money/pay?orderId=${item._id}&price=${item.all_amount}`)">去付款</text>
		<!-- 				<text data-type="shouhuo"  class="act" >确认收货</text>
						<text data-type="del"  class="act" >删除订单</text>
						<text data-type="del"  >删除订单</text>
						<text data-type="detail"  class="act" >去评价</text> -->
					</view>
				</template>
			</view>
		</view>
		<uni-load-more :status="staMore"></uni-load-more>
	</view>
</template>

<script>
	import {getOrderList} from '@/utils/API/oederForm.js'
	import {mapState} from  'vuex'
export default{
	data(){
		return{
			skip:0,
			status:0,
			limit:10,
			orderList:[],
			count:null,
			staMore:'more'
		}
	},
	onLoad() {
		this.getOrder()
	},
	// // 上拉加载
	onReachBottom() {
		let allTotal = this.orderList.length
		if (allTotal < this.count) {
			this.staMore = 'loading'
			this.skip+=10 
			this.getOrder()
			
		} else {
		this.staMore='noMore'
		uni.showToast({
			title: '获取完毕',
			duration: 500,
			success: (res) => {
				console.log(res);
			}
		});
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
	
		this.orderList=[]
		this.getOrder()

		setTimeout(() => {
			//结束下拉刷新
			uni.stopPullDownRefresh()
		}, 1000)
	},
	computed:{
		...mapState(['uid'])
	},
	methods:{
		getOrder(){
			let {uid,skip,limit,status}=this
			getOrderList({uid,skip,limit,status}).then(res=>{
				console.log(res);
				if(res.code==1){
					this.count=res.count
					this.orderList.push(...res.data)
				}
			})
		},
		
		// 全部
		allStatus(){
			this.status=0
			this.orderList=[]
			this.getOrder()
		},
		// 待付款
		obligation(){
			this.status=1
			this.orderList=[]
			this.getOrder()
		},
		// 待发货
		dropShipping(){
			this.status=2
			this.orderList=[]
			this.getOrder()
		},
		// 待收获
		receiving(){
			this.status=3
			this.orderList=[]
			this.getOrder()
		},
		// 已完成
		completed(){
			this.status=7
			this.orderList=[]
			this.getOrder()
		},
	
	}
}
</script>

<style lang="scss">
input::-webkit-input-placeholder {
	color: #ccc;
}

input::-moz-input-placeholder {
	color: #ccc;
}

input::-ms-input-placeholder {
	color: #ccc;
}

// .uni-load-more{

// 	margin-top: 100upx;
// }
.order_ipt {
	width: 580upx;
	height: 30px;
	border: 1px #eee solid;
	border-radius: 20px;
	font-size: 30upx;
	line-height: 30px;
	color: #666;
	padding: 0 10px;
	margin: 7.5px 0;
	text-align: center;
}

.order_box {
	width: 100%;
	height: auto;
	overflow: hidden;
	padding: 100rpx 30rpx 20rpx;
	// padding: 50rpx 0 0 0;
	// padding-top: 80rpx;
	.order_list {
		width: 100%;
		height: auto;
		overflow: hidden;
		background: white;
		border-radius: 16upx;
		margin-top: 30upx;
		padding: 20upx;

		.order_top {
			width: 100%;
			height: auto;
			overflow: hidden;

			image {
				display: block;
				width: 40upx;
				height: 38upx;
				float: left;
				border-radius: 6rpx;
			}

			.order_pa {
				font-size: 28upx;
				color: #333;
				line-height: 38upx;
				float: left;
				margin-left: 16upx;
			}

			.order_pb {
				font-size: 24upx;
				line-height: 38upx;
				color: $color1;
				float: right;
			}
		}

		.order_center {
			width: 100%;
			height: auto;
			overflow: hidden;
			margin-top: 24upx;

			image {
				display: block;
				width: 200upx;
				height: 200upx;
				float: left;
			}

			.order_good {
				width: calc(100% - 200upx);
				height: 200rpx;
				padding-left: 20upx;
				overflow: hidden;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.order_pc {
					font-size: 24upx;
					color: #000000;
					height: 76upx;
					width: 100%;
					line-height: 36upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.order_pd {
					font-size: 24upx;
					color: #999999;
					margin-top: 16upx;
					display: block;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.order_pe {
					font-size: 32upx;
					color: $color1;
					font-weight: bold;
					display: flex;
					width: 100%;
					justify-content: space-between;
					align-items: center;

					text {
						color: #999999;
						font-size: 24upx;
						font-weight: normal;
					}
					.price {
						color: $color1;
					}
				}
			}
		}

		.order_fee {
			width: 100%;
			height: 50rpx;
			overflow: hidden;
			line-height: 50rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			margin-top: 8px;

			.order_pf {
				font-size: 24upx;
				display: block;
				float: left;
				line-height: 29upx;
				color: #999999;
			}

			.order_pg {
				font-size: 24upx;
				display: block;
				float: right;
				line-height: 29upx;
				color: #999999;
			}
		}

		.order_bottom {
			width: auto;
			height: auto;
			float: right;
			margin-top: 16upx;
			overflow: hidden;

			text {
				display: inline-block;
				min-width: 130upx;
				height: 48upx;
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(191, 191, 191, 1);
				opacity: 1;
				border-radius: 30upx;
				font-size: 24upx;
				text-align: center;
				padding: 0 17upx;
				line-height: 48upx;
				margin-left: 24upx;
			}

			.act {
				color: white;
				background: $color1;
				border: 1px solid $color1;
			}
		}
	}
}

.icon-sousuo11 {
	font-size: 40upx;
	color: #999999;
}

.icon-fanhui11 {
	font-size: 32upx;
}

.order_tit {
	width: 100%;
	height: 87upx;
	position: fixed;
	left: 0;
	z-index: 22;
	background: white;

	.scroll {
		height: 87upx;

		text {
			display: block;
			width: 20%;
			height: auto;
			line-height: 87upx;
			float: left;
			text-align: center;
			font-size: 28upx;
			position: relative;
			color: #999999;
		}

		.act {
			color: $color1;

			&:before {
				content: '';
				width: 64upx;
				height: 8upx;
				background: $color1;
				border-radius: 80upx;
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				margin: auto;
			}
		}
	}
}
</style>
