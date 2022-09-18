<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{totalPrice}}</text>
		</view>

		<view class="pay-type-list">
			<view class="type-item b-b">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<view class="iconfont icon-xuanzhong checkbox" :class="{checked:pay_type=='wxpay'}"
					@click="pay_type='wxpay'"></view>
			</view>

			<view class="type-item b-b">
				<text class="icon yticon icon-alipay"></text>
				<view class="con"><text class="tit">支付宝支付</text></view>
				<view class="iconfont icon-xuanzhong checkbox" :class="{checked:pay_type=='alipay'}"
					@click="pay_type='alipay'"></view>
			</view>

			<!-- 			<view class="type-item" >
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">预存款支付</text>
					<text>可用余额 ¥198.5</text>
				</view>
<view class="iconfont icon-xuanzhong checkbox "></view>
			</view> -->
		</view>

		<text class="mix-btn" @click="getpayOrder">确认支付</text>
	</view>
</template>

<script>
	import {
		payOrder
	} from '@/utils/API/oederForm.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				orderId: '',
				pay_type: 'wxpay',
				orderNumber: {},
				payOrderList: {},
				totalPrice: ''
			}
		},
		onLoad(options) {
			this.orderId = options.orderId
			this.totalPrice = options.price
		},
		computed: {
			...mapState(['token'])
		},
		methods: {
			getpayOrder() {
				let {
					token,
					orderId,
					pay_type
				} = this
				uni.showLoading({
							title: '加载中...'
					})
				payOrder({
					token,
					orderId,
					pay_type
				}).then((res) => {
					console.log(res);
					
					if (res.code == 1) {
						this.orderNumber = res.data
						if (this.pay_type) {
							uni.requestPayment({
								provider: 'alipay',
								orderInfo: res.data.orderInfo,
								success: function(res) {
									console.log('success:' + JSON.stringify(res.data));
									this.payOrderList = res.data
									
									setTimeout((v) => {
										uni.hideLoading()
									})
									
									
									uni.navigateTo({
										url:'/pages/money/paySuccess'
									})
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});
						} else {
							uni.requestPayment({
								provider: 'wxpay',
								"orderInfo": {
									"appid": "wxa1708667f04d03d8", // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
									"noncestr": "c5sEwbaNPiXAF3iv", // 随机字符串
									"package": "Sign=WXPay", // 固定值
									"partnerid": "148*****52", // 微信支付商户号
									"prepayid": res.data.orderInfo, // 统一下单订单号 
									"timestamp": 1597935292, // 时间戳（单位：秒）
									"sign": "A842B45937F6EFF60DEC7A2EAA52D5A0" // 签名，这里用的 MD5/RSA 签名
								},
								success: function(res) {
									console.log('success:' + JSON.stringify(res));
									this.payOrderList = res.data
									setTimeout((v) => {
										uni.hideLoading()
									})
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});
						}
						
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		text {
			font-size: 36rpx;
		}

		.price {
			font-size: 50upx;
			color: $color1;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

	.checkbox {
		color: #d1d1d1;
		font-size: 40upx;

		&.checked {
			color: rgb(250, 67, 106);
		}
	}
</style>
