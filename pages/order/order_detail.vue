<template>
	<view class="">
		<view v-for="item in  rderdetail">
			<view>
				<block>
					<view class="order_tit">
						<text class="item.icon"></text>
						<text class="order_yy"></text>
					</view>
				</block>
			</view>
			<view class="order_addr">
				<text class="iconfont icon-ditu_dingwei"></text>
				<view class="order_addrBox">
					<text class="order_name">
						收货人：蝙蝠侠
						<text>13112345678</text>
					</text>
					<text class="order_dizhi">河南郑州新郑龙湖华南城</text>
				</view>
			</view>
			<view class="order_good">
				<block>
					<view class="order_list" v-for="(item2,index) in item.goods">
						<view class="info">
							<image :src="item2.img"></image>
							<view class="order_goodBox">
								<view class="order_goodName">{{item2.name}}</view>
								<view class="order_goodAttr">{{item2.attr}}</view>
								<view class="order_price">
									<text class="order_jq">¥{{item2.price}}</text>
									<text class="order_num">x{{item2.num}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="order_btn">
						<!-- 	<text :data-img="item.thumb" :data-id="item._id" :data-name="item.title" :data-attr="item.attr"
						 :data-price="item.price" :data-num="item.num" @click="tuikuan" v-if="item.status == 2">退款</text> -->
						<text class="act">评价</text>
					</view>
				</block>
			</view>
			<view class="order_cont">
				<view class="order_contBox">
					<text class="order_contPa">商品总额</text>
					<text class="order_contPb">¥{{item.all_amount}}</text>
				</view>
				<view class="order_contFinal">
					<text class="order_contPa">应付金额</text>
					<text class="order_contPb">¥{{item.base_money}}</text>
				</view>
			</view>
			<view class="order_main">
				<text class="order_mainTit">订单信息</text>
				<view class="order_mainBox">
					<text class="order_mainPa">下单时间</text>
					<text class="order_mainPb">{{item.update_time|fomatterDate}}</text>
				</view>
				<view class="order_mainBox">
					<text class="order_mainPa">订单编号</text>
					<text class="order_mainPb">{{item.order_sn}}</text>
				</view>
				<view class="order_mainBox">
					<text class="order_mainPa">付款金额</text>
					<text class="order_mainPb">{{item.all_amount}}元</text>
				</view>
				<view class="order_mainBox">
					<text class="order_mainPa">支付方式</text>
					<text class="order_mainPb">{{item.pay_type}}</text>
				</view>
				<view class="order_mainBox">
					<text class="order_mainPa">支付时间</text>
					<text class="order_mainPb">{{item.pay_time|fomatterDate}}</text>
				</view>
				<view class="order_mainBox">
					<text class="order_mainPa">物流公司</text>
					<text class="order_mainPb">申通快递</text>
				</view>
				<view class="order_mainBox">
					<text class="order_mainPa">物流单号</text>
					<text class="order_mainPb">ST23432423434</text>
				</view>
				<view class="order_mainBox">
					<text class="order_mainPa">订单备注</text>
					<text class="order_mainPb">无备注</text>
				</view>
				<view class="order_mainBox">
					<text class="order_mainPa">取消原因</text>
					<text class="order_mainPb">不想买了</text>
				</view>
			</view>
			<view class="order_finals">

				<!-- ######################  不要删除 -->


				<view class="order_finalsRight">
					<text @click="cancelOrderShow=true">取消订单</text>
					<text class="act" @click="navTo(`/pages/money/pay?orderId=${item._id}&price=${item.all_amount}`)">去付款</text>
				</view>
				<!-- 				<view class="order_finalsRight">
					<text class="act">查看物流</text>
					<text class="act">确认收货</text>
				</view> -->


				<!-- <view class="order_finalsRight"><text>删除订单</text></view> -->


				<!-- 				<view class="order_finalsLeft">
					<view class="order_finalBox">
						<text class="iconfont icon-dianhua"></text>
						<text class="order_finalPa">联系客服</text>
					</view>
				</view> -->



				<!-- ###################### -->
			</view>
		</view>

		<!-- 		<tui-bottom-popups style="display: none;"></tui-bottom-popups> -->
		<u-popup :show="cancelOrderShow" @close="cancelOrderShow=false">
			<view class="tui-popup-box">
				<view>请您填写一下取消原因：</view>
				<input type="text" v-model="cancelText" placeholder="请输入" />

				<view class="button_wrap">
					<button type="default" @click="cancelOrderShow=false">取消</button>
					<button type="primary" @click="ensureOrder">确定</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getOrderDetail,
		cancelOrder
	} from '@/utils/API/oederForm.js'
	import {
		fomatterDate
	} from 'pages/user/data.js'
	export default {
		data() {
			return {
				orderId: '',
				rderdetail: [],
				cancelOrderShow:false,
				cancelText:''
			}
		},
		onLoad(options) {
			this.orderId = options.orderId
			this.orderDetail()
		},
		computed: {
			uid() {
				return this.$store.state.uid
			}
		},
		filters: {
			fomatterDate
		},
		methods: {
			// 订单详情
			orderDetail() {
				let {
					uid,
					orderId
				} = this
				getOrderDetail({
					uid,
					orderId
				}).then((res) => {
					console.log(res);
					if (res.code == 1) {
						this.rderdetail = res.data
					}
				})
			},
			// 取消订单
			ensureOrder() {
				this.cancelOrderShow=false
				let {cancelText,orderId}=this
				cancelOrder({cancel_text:cancelText,orderId}).then(res => {
					console.log(res);
					if(res.code==1){
						this.cancelText=[]
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.popover_tit {
		width: 100%;
		height: auto;
		overflow: hidden;
		position: relative;

		&:before {
			content: '';
			position: absolute;
			left: 30upx;
			right: 30upx;
			bottom: 0;
			background: #eeeeee;
			transform: scaleY(0.5);
			height: 1px;
		}

		.popover_bt {
			font-size: 32upx;
			font-weight: 500;
			line-height: 90upx;
			display: block;
			text-align: center;
		}

		.iconfont {
			position: absolute;
			right: 30upx;
			top: 0;
			bottom: 0;
			margin: auto;
			color: #666;
			font-size: 42upx;
			line-height: 90upx;
		}
	}

	.tui-popup-scroll {
		max-height: 342upx;
	}

	.popover_main {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 0 30upx;

		.popover_choose {
			width: 100%;
			height: auto;
			overflow: hidden;
			border-bottom: 1px #eeeeee solid;

			.iconfont {
				font-size: 36upx;
				line-height: 100upx;
				display: block;
				float: left;
				width: 36upx;
				height: 36upx;
			}

			.popover_reason {
				display: block;
				float: left;
				margin-left: 24upx;
				font-size: 30upx;
				color: #000000;
				line-height: 100upx;
			}
		}

		.act .iconfont:before {
			content: '\E655';
			color: $color1;
		}
	}

	.popover_btn {
		width: 100%;
		height: 100upx;
		background: white;
		border: 1px solid #f12435;
		color: #f12435;
		margin-top: 30upx;
		font-size: 32upx;
		// color: white;
		text-align: center;
		line-height: 100upx;
	}

	.order_tui {
		width: 100%;
		height: auto;
		background: white;
		overflow: hidden;

		.order_tuiTit {
			font-size: 30upx;
			border-bottom: 1px #eeeeee solid;
			font-weight: bold;
			line-height: 100upx;
			padding: 0 30upx;
			display: block;
			overflow: hidden;
		}

		.order_tuiBox {
			width: 100%;
			height: auto;
			overflow: hidden;
			padding: 0 30upx;
			border-bottom: 1px solid rgba(238, 238, 238, 1);

			.order_tuiPa {
				font-size: 30upx;
				color: #333333;
				line-height: 100upx;
				float: left;
				display: block;
				width: 160upx;
			}

			.order_tuiPb {
				font-size: 30upx;
				color: #333333;
				line-height: 100upx;
				float: left;
				display: block;
				width: calc(100% - 160upx);
			}

			.order_tuiImgBox {
				width: auto;
				height: auto;
				float: left;
				margin: 30upx 0;
				overflow: hidden;

				image {
					display: block;
					width: 176upx;
					height: 176upx;
					border-radius: 20upx;
				}

				text {
					display: block;
					text-align: center;
					font-size: 30upx;
					color: #e33b2d;
					margin-top: 24upx;
				}
			}
		}
	}

	.order_finals {
		width: 100%;
		height: 100upx;
		padding: 0 10px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.04);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 22;
		display: flex;
		justify-content: space-between;
		flex-direction: row-reverse;

		.order_finalsLeft {
			width: 190rpx;
			height: 100rpx;
			overflow: hidden;

			.order_finalBox {
				height: 100rpx;
				overflow: hidden;
				display: flex;
				align-items: center;
				align-items: center;

				.iconfont {
					display: block;
					text-align: center;
					font-size: 42upx;
					color: $color1;
					margin-top: 10upx;
					margin-right: 5px;
				}

				.order_finalPa {
					font-size: 24upx;
					display: block;
					text-align: center;
					margin-top: 5upx;
				}
			}
		}

		.order_finalsRight {
			width: auto;
			height: auto;
			float: right;
			overflow: hidden;

			text {
				width: 130upx;
				height: 56upx;
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(191, 191, 191, 1);
				border-radius: 80upx;
				font-size: 24upx;
				line-height: 56upx;
				text-align: center;
				margin-top: 20upx;
				margin-right: 20upx;
				display: inline-block;
			}

			.act {
				background: $color1;
				border: 1px solid $color1;
				color: white;
			}
		}
	}

	.order_final {
		width: 100%;
		height: 100upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.04);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 22;

		.order_finalBox {
			width: 50%;
			height: 100upx;
			float: left;
			position: relative;

			&:nth-child(1):before {
				content: '';
				position: absolute;
				width: 1upx;
				height: 60upx;
				background: #eeeeee;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
			}

			text {
				font-size: 32upx;
				color: #333333;
				line-height: 100upx;
				text-align: center;
				display: block;

				text {
					display: inline-block;
					font-size: 56upx;
					color: #666666;
					margin-right: 24upx;
					vertical-align: middle;
				}
			}
		}
	}

	.order_main {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 0 30rpx 140rpx 30rpx;
		background: white;
		margin-top: 20rpx;

		.order_mainTit {
			display: block;
			font-size: 32upx;
			line-height: 38upx;
			padding: 30upx 0;
			border-bottom: 1px #eeeeee solid;
		}

		.order_mainBox {
			width: 100%;
			height: auto;
			overflow: hidden;
			margin-top: 30upx;

			.order_mainPa {
				font-size: 24upx;
				color: #999999;
				line-height: 29upx;
				display: block;
				width: 120upx;
				float: left;
			}

			.order_mainPb {
				font-size: 24upx;
				color: #999999;
				line-height: 29upx;
				display: block;
				width: calc(100% - 120upx);
				float: left;
			}
		}
	}

	.order_cont {
		width: 100%;
		height: auto;
		overflow: hidden;
		margin-top: 20upx;
		padding: 30upx;
		background: white;

		.order_contBox {
			width: 100%;
			height: auto;
			padding: 10upx 0;
			overflow: hidden;

			.order_contPa {
				font-size: 24upx;
				color: #999999;
				line-height: 45upx;
				float: left;
				display: block;
			}

			.order_contPb {
				font-size: 24upx;
				color: #000000;
				line-height: 45upx;
				float: right;
				display: block;
			}
		}

		.order_contFinal {
			width: 100%;
			height: auto;
			padding: 10upx 0;
			overflow: hidden;

			.order_contPa {
				font-size: 28upx;
				color: #333333;
				line-height: 45upx;
				float: left;
				display: block;
			}

			.order_contPb {
				font-size: 32upx;
				color: $color1;
				line-height: 45upx;
				font-weight: bold;
				float: right;
				display: block;
			}
		}
	}

	.order_good {
		width: 100%;
		height: auto;
		overflow: hidden;
		background: white;
		padding: 0 30upx;

		.order_shop {
			width: 100%;
			height: auto;
			border-bottom: 1px #eeeeee solid;
			padding: 40upx 0 26upx;
			overflow: hidden;

			image {
				display: block;
				width: 40upx;
				height: 38upx;
				float: left;
			}

			text {
				font-size: 28upx;
				color: #333333;
				line-height: 38upx;
				display: block;
				float: left;
				margin-left: 16upx;
			}
		}

		.order_list {
			width: 100%;
			height: auto;
			margin-top: 30upx;
			display: flex;
			justify-content: space-between;
			padding-bottom: 20upx;
			border-bottom: 1px solid #f2f2f2;

			.info {
				margin-right: 10upx;
				display: flex;
				justify-content: flex-start;
				flex: 1 1 auto;
			}

			image {
				display: block;
				width: 200upx;
				height: 200upx;
				flex: 0 0 auto;
			}

			.order_goodBox {
				display: flex;
				height: 200upx;
				padding-left: 20upx;
				flex-wrap: wrap;
				flex: 1;
				align-content: space-between;

				.order_goodName {
					width: 100%;
					height: 88upx;
					font-size: 24upx;
					line-height: 44upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.order_goodAttr {
					font-size: 24upx;
					color: #999999;
					line-height: 40rpx;
					justify-self: flex-start;
				}
			}

			.order_price {
				display: flex;
				width: 100%;
				justify-content: space-between;
				align-items: center;

				.order_jq {
					font-size: 32upx;
					font-weight: bold;
					line-height: 45upx;
					color: $color1;
				}

				.order_num {
					font-size: 24upx;
					color: #999999;
				}
			}
		}

		.order_btn {
			overflow: hidden;
			float: right;
			width: auto;
			margin-top: 30upx;
			padding-bottom: 30upx;

			text.act {
				border: 1px solid $color1;
				color: #fff;
				background: $color1;
			}

			text {
				display: block;
				width: 130upx;
				height: 48upx;
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(191, 191, 191, 1);
				border-radius: 30upx;
				line-height: 48upx;
				color: #333333;
				text-align: center;
				font-size: 24upx;
				float: right;
				margin-left: 30upx;
			}
		}
	}

	.order_addr {
		width: 100%;
		height: auto;
		padding: 40upx 30upx 20upx 30upx;
		background: white;
		position: relative;
		overflow: hidden;

		&:before {
			content: '';
			position: absolute;
			height: 1px;
			background: #eeeeee;
			left: 30upx;
			right: 30upx;
			bottom: 0;
			transform: scaleY(0.5);
		}

		.iconfont {
			color: #999999;
			font-size: 36upx;
			float: left;
			display: block;
		}

		.order_addrBox {
			width: calc(100% - 50upx);
			height: auto;
			float: left;
			overflow: hidden;
			padding-left: 20upx;

			.order_name {
				font-size: 28upx;
				display: block;
				color: #000000;
				line-height: 40upx;

				text {
					margin-left: 24upx;
					font-size: 28upx;
					color: #333333;
				}
			}

			.order_dizhi {
				display: block;
				font-size: 28upx;
				color: #999999;
				line-height: 34upx;
				margin-top: 11upx;
			}
		}
	}

	.order_tit {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 0 30upx;
		background: linear-gradient(90deg, #fdd100 0%, #fa416a 100%);

		.yticon,
		.iconfont {
			font-size: 36upx;
			line-height: 104upx;
			display: block;
			float: left;
			color: white;
		}

		.order_yy {
			font-size: 32upx;
			margin-left: 20upx;
			line-height: 104upx;
			color: white;
			display: block;
			float: left;
		}

		.tui-countdown {
			font-size: 28upx;
			line-height: 104upx;
			float: right;

			.time {
				color: #fff;
				margin-right: 16upx;
			}
		}
	}

	.tui-popup-box {
		padding: 40rpx;

		.label {
			line-height: 40rpx;
			font-size: 32rpx;
			color: #333;
		}

		input {
			border: 1px solid #eee;
			border-radius: 5px;
			margin: 15px 0;
			line-height: 68rpx;
			height: 68rpx;
			font-size: 13px;
		}

		.button_wrap {
			display: flex;
			align-items: center;
			justify-content: space-around;
		}

		button {
			width: 260rpx;
		}
	}
</style>
