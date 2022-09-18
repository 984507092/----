<template>
	<scroll-view class="container" scroll-y="true" @scroll="pageScroll">
		<view class="title-contents" :class="headerActive?'act':''">
			<!--  #ifdef APP-PLUS -->
			<view class="top-view status" style="background: rgba(255,255,255,0)"></view>
			<!--  #endif -->
			<view class="_top titles">
				<view class="titleLeftButton" @click="back()"><text class="iconfont icon-fanhui"></text></view>
				<view class="titleText">
					<view class="title-item active">商品</view>
					<view class="title-item">详情</view>
					<view class="title-item">评论</view>
				</view>
				<view class="titleRightButton"><text class="iconfont icon-gouwuche2"></text></view>
			</view>
		</view>
		<view class="firstPart" id="">
			<!-- 轮播图 -->
			<view class="swiper-wrapper">
				<swiper indicator-dots="true" indicator-color="#666" indicator-active-color="#fff" autoplay="true"
					circular="true">
					<swiper-item v-for="item in goodBanner">
						<image :src="item" />
					</swiper-item>

				</swiper>
			</view>

			<view class="goods-info" v-for="item in goods_list">
				<view class="goods-price">
					<text class="price">
						<text>￥</text>
						{{item.price}}
					</text>
					<text class="through-price">￥{{item.old_price}}</text>
				</view>
				<view class="goods-title">{{item.name}}</view>
				<view class="sales">
					<text>快递:包邮</text>
					<text>月销{{item.sales}}</text>
				</view>
			</view>
		</view>

		<view class="evaluate">
			<view class="evaluate_title">
				<view class="title_name">
					<text>评价</text>
					<text>{{total}}</text>
				</view>
				<view class="title_goto">
					<text>查看更多</text>
					<text class="iconfont icon-qianwang"></text>
				</view>
			</view>
			<view class="evaluate_con" v-for="item in appraise">
				<view class="con_title">
					<image :src="item.userInfo.avatar" mode=""></image>
					<text class="Name">{{item.userInfo.nickname}}</text>
				</view>
				<view class="con_con">{{item.content}}</view>
				<view class="con_img">
					<image :src="item.images" mode=""></image>
				</view>
			</view>
		</view>

		<view class="goods-detail">
			<view class="title">
				<view class="title_name"><text>图文详情</text></view>
			</view>
			<view class="content" v-for="item in goods_list">
				<!-- <image :src="item.desc" mode="widthFix"></image> -->
				<view style="width: 100%;" v-html="item.desc"></view>
			</view>
		</view>
		<view class="footer">
			<view class="isfav" @click="isFav">
				<u-icon name="star" :color="actColor" size="30px"></u-icon>
			</view>
			<view class="btn cart" @click="goodCar=true">加入购物车</view>
			<view class="btn buy" @click="shopBuy">立即购买</view>
		</view>
		<view class="mask" v-if="goodCar"></view>
		<view class="mask-content" v-if="goodCar" v-for="item in goods_list">
			<view class="header">
				<view class="title">
					<image :src="item.img" mode=""></image>
					<view class="tablePrice">
						<text class="good_price">
							<text>￥</text>
							{{defaultSkuInfo.price||goodSku.price}}
						</text>
						<text>
							<text>库存 ：{{defaultSkuInfo.stock||goodSku.stock}}</text>
						</text>
						<text>
							<text>已选：</text>
							<!-- <text v-for="item in goodSku.text" v-if="goodSku.text.length">{{item}}</text> -->
							<text>{{sku_lite.join(',')}}</text>
						</text>
					</view>
				</view>
				<image src="/static/images/common/close.png" mode="" @click="goodCar=false"></image>
			</view>
			<view>
				<view v-for="(a,b) in attr">
					<view class="choose-title">{{a.text}}</view>
					<scroll-view class="type-view" scroll-y>
						<view class="list">
							<view class="items" :class="sku_lite[b]==t.text?'activeText':''" v-for="(t,i) in a.values"
								:key="i" @click="getsku(b,t)">
								<text>{{t.text}}</text>
							</view>
							<!-- <view class="item">中包</view> -->
						</view>
					</scroll-view>
				</view>
			</view>

			<view class="goods-number">
				<text>数量</text>
				<number-box :min="1" :max="999" :value="amount" @reduce="reduce" @plus="add" :step="1"></number-box>
			</view>
			<view class="choose-footer" @click="shopCar">确定</view>
		</view>
	</scroll-view>
</template>

<script>
	import {
		getGoodsDetail,
		getGoodsComment,
		changeCartNum,
		getSku,
		addCart,
		toggleFav
	} from '@/utils/API/good.js'
	import numberBox from '../../components/numberbox/numberbox.vue';

	export default {
		components: {
			numberBox
		},
		data() {
			return {
				headerActive: false,
				goods_id: '',
				goods_list: [], //总
				goodBanner: [], //轮播
				attr: [], //规格
				table: [], //表格
				defaultSkuInfo: {}, //默认sku_info
				appraise: {}, //评论
				skip: 0,
				limit: 10,
				total: '',
				goodCar: false,
				active: 0,
				amount: 1,
				actColor: "",
				// 保存sku的
				sku_lite: [],
				goodSku: {
					price: 0,
					stock: 0,
					text: []
				},
				is_fav: 0,
				type: 'add'
			};
		},
		onLoad(options) {
			this.goods_id = options.goods_id
			this.getGoodsParti()
			this.evaluate()
			this.isFav()

		},
		computed: {
			uid() {
				return this.$store.state.uid
			}
		},
		methods: {
			// 选择规格
			getsku(index, sku) {
				// this.activeText=index
				// 写入保存的规格数组里
				this.$set(this.sku_lite, index, sku.text)
				this.sku_lite[index] = sku.text
				// 保存的价格和库存

				let _id
				this.goods_list.forEach((v) => {
					_id = v._id
				})

				getSku({
					goods_id: _id,
					sku: this.sku_lite
				}).then((res) => {
					console.log(res.data);

					if (this.attr.length == this.sku_lite.length) {
						this.goodSku = res.data
					} else if (this.attr.length == 1) {
						this.goodSku = res.data
					}
					/**
					// switch(this.sku_lite.length){
					// 	case 0:
					// 		this.goodSku=this.defaultSkuInfo
					// 	break
					// 	case 1:
					// 		this.goodSku.price=res.data.price
					// 		this.goodSku.stock=res.data.stock
					// 		this.goodSku.text=res.data.text
					// 	break
					// 	default:
					// 		this.goodSku.price=res.data.price
					// 		this.goodSku.stock=res.data.stock
					// 		this.goodSku.text=res.data.text
					// 	break
					// }
					*/
				})

			},
			//监控页面滚动,控制头部变色
			pageScroll(e) {
				this.headerActive = e.target.scrollTop >= 60;
			},

			// 加
			add(v) {
				// console.log(v);
				this.amount = v
				changeCartNum({
					_id: this.goods_id,
					num: this.amount
				}).then((res) => {
					console.log(res);
				})
			},
			// 减
			reduce(v) {
				this.amount = v

				changeCartNum({
					_id: this.goods_id,
					num: this.amount
				}).then((res) => {
					console.log(res);
				})
			},

			// 立即购买
			shopBuy() {
				this.goodCar = true
				this.type = 'buy'
			},
			// 跳转购物车
			shopCar() {
				let {
					uid,
					goods_id,
					sku_lite,
					amount: num,
					type
				} = this
				if (type == 'buy') {
					addCart({
						uid,
						goods_id,
						attr: sku_lite,
						num,
						type
					}).then((res) => {
						console.log(res);
						if (res.code == 1) {
							this.goodCar = false
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
							this.type = 'add'
							setTimeout((v) => {
								uni.navigateTo({
									url: `/pages/order/createOrder?type=buy&cart_id=${res.data.id}`
								})
							}, 800)
						}
					})
				} else {
					addCart({
						uid,
						goods_id,
						attr: sku_lite,
						num,
						type
					}).then((res) => {
						console.log(res);
						if (res.code == 1) {
							this.goodCar = false
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})

						}
					})
				}
			},



			// banner
			getGoodsParti() {
				let {
					uid,
					goods_id
				} = this
				getGoodsDetail({
					goods_id,
					uid
				}).then((res) => {
					console.log(res);
					if (res.code == 1) {
						this.goods_list = res.data
						this.is_fav = res.is_fav
						this.goods_list.forEach((v, k) => {
							console.log(v);
							this.goodBanner = v.banner
							this.attr = v.attr
							this.table = v.table
							this.defaultSkuInfo = v.default_sku_info

						})
					}
				})
			},
			// 评价
			evaluate() {
				let {
					goods_id,
					skip,
					limit
				} = this
				getGoodsComment({
					goods_id,
					skip,
					limit
				}).then((res) => {
					console.log(res);
					this.total = res.count
					this.appraise = res.data
				})
			},
			isFav() {
				// this.is_fav != this.is_fav
				let {
					uid,
					goods_id,
					is_fav
				} = this

				toggleFav({
					uid,
					goods_id,
					is_fav
				}).then((res) => {
					if (is_fav) {
						this.actColor = '#FDD100'
						this.is_fav = 0
					} else {
						this.actColor = ''
						this.is_fav = 1
					}
				})
			},
		}
	};
</script>

<style lang="scss">
	::v-deep img {
		width: 100%;
	}

	.items {
		display: block;
		border: 1px solid #ccc;
		margin: 0 15rpx;
		padding: 10rpx;
		border-radius: 20rpx;
	}

	.good {
		background: #FDD100;
	}

	.title {
		display: flex;
		justify-content: flex-start;
	}

	.tablePrice {
		display: flex;
		flex-direction: column;
		justify-content: center;

		.good_price {
			margin-top: 5px;
			color: red !important;

			text {
				color: red !important;
			}
		}

		text {
			margin: 5px 0;
			margin-left: 0 !important;
			color: #ccc !important;
		}

	}

	.activeText {
		background: #FDD100;
	}

	.activeTitle {
		background: #FDD100;
	}

	.isfav {
		margin: 0 50rpx;

	}








	page {
		width: 100%;
		height: 100%;
		background-color: #f5f5f7;

		.container {
			background-color: #f5f5f7;
			height: 100%;

			.title-contents {
				position: fixed;
				top: 0;
				width: 100%;
				height: calc(var(--status-bar-height) + 88upx);
				z-index: 1000;
				background: rgba(255, 255, 255, 0);

				.top-view {
					width: 100%;
					height: var(--status-bar-height);
				}

				&.act {
					background: rgba(255, 255, 255, 1);
					border-bottom: 1px solid #eee;

					.titles .titleRightButton .iconfont {
						color: #fff;
					}

					.titles .titleLeftButton .iconfont {
						color: #fff;
					}

					.titles .titleText {
						opacity: 1;
					}
				}

				.titles {
					display: flex;
					flex-direction: row;
					justify-content: center;
					height: 88upx;

					.mp-titleLeftButton {
						width: 88upx;
						height: 88upx;
					}

					.titleLeftButton {
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 14upx;
						width: 60upx;
						height: 60upx;
						line-height: 60upx;
						text-align: center;
						border-radius: 50%;
						background: rgba(0, 0, 0, 0.5);

						.iconfont {
							font-size: 16px;
							color: #fff;
						}
					}

					.titleText {
						display: flex;
						justify-content: space-around;
						align-items: center;
						width: 574upx;
						height: 88upx;
						margin: 0 auto;
						opacity: 0;

						.title-item {
							position: relative;
							height: 88upx;
							line-height: 88upx;
							font-size: 36upx;
							color: #666;

							&.active {
								color: #000;

								&::after {
									position: absolute;
									bottom: 0;
									left: 50%;
									content: ' ';
									margin-left: -25upx;
									width: 50upx;
									height: 6upx;
									background: $theme-color;
								}
							}
						}
					}

					.titleRightButton {
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 14upx;
						width: 60upx;
						height: 60upx;
						line-height: 60upx;
						text-align: center;
						border-radius: 50%;
						background: rgba(0, 0, 0, 0.5);
						color: #fff;

						.iconfont {
							font-size: 19px;
							color: #fff;
						}
					}
				}
			}

			.firstPart {
				.swiper-wrapper {
					/*  #ifdef  MP-WEIXIN  */
					min-height: 88upx;
					/*  #endif  */
					width: 100%;
					/*  #ifndef  MP-WEIXIN  */
					min-height: calc(var(--status-bar-height) + 88upx);

					/*  #endif  */
					swiper {
						width: 100%;
						height: 750upx;

						image {
							width: 100%;
							height: 750upx;
						}
					}
				}

				.seckill {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 0 25upx;
					box-sizing: border-box;
					width: 100%;
					height: 100upx;
					background: #fb5248;

					.goods-price {
						display: flex;
						flex-direction: row;
						align-items: center;
						height: 100upx;

						.price {
							font-size: 44upx;
							color: #fff;

							text {
								font-size: 28upx;
							}
						}

						view {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							margin-left: 24upx;
							padding: 20upx 0;
							box-sizing: border-box;
							font-size: 22upx;
							color: #fff;

							.through-price {
								text-decoration: line-through;
							}
						}
					}

					.progress-wrapper {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding: 16upx 0 22upx;
						height: 100upx;
						box-sizing: border-box;
						font-size: 22upx;
						color: #fee900;
					}
				}

				.goods-info {
					padding: 0 25upx;
					box-sizing: border-box;
					background: #fff;
					overflow: hidden;

					.goods-price {
						line-height: 84upx;

						.price {
							font-size: 36upx;
							color: #fb5248;

							text {
								font-size: 24upx;
							}
						}

						.through-price {
							margin-left: 30upx;
							font-size: 22upx;
							color: #999;
							text-decoration: line-through;
						}
					}

					.goods-title {
						margin-top: 20upx;
						line-height: 42upx;
						font-size: 32upx;
						color: #111;
					}

					.sales {
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 84upx;
						font-size: 24upx;
						color: #666;
					}
				}
			}

			.coupon {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 90upx;
				margin: 20upx 0 0;
				background-color: #fff;
				padding: 0 25upx;
				box-sizing: border-box;
				font-size: 28upx;
				color: #666;

				.title {
					text {
						&:nth-child(2n) {
							margin-left: 30upx;
							color: #111;
						}

						&:last-child {
							color: #fb5248;
						}
					}
				}

				.get-coupon {
					text {
						padding: 2upx 8upx;
						box-sizing: border-box;
						background: rgba(251, 82, 72, 0.1);
						color: #fb5248;
						border-radius: 6upx;
					}
				}
			}

			.spec {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20upx;
				height: 74upx;
				background-color: #fff;
				padding: 0 25upx;
				box-sizing: border-box;
				font-size: 28upx;
				color: #666;

				&.delivery {
					margin-top: 0;
				}

				.title {
					text {
						&:last-child {
							margin-left: 30upx;
							color: #111;
						}
					}
				}

				.arrow {
					.iconfont {
						color: #999;
						font-size: 12px;
					}
				}
			}

			.evaluate {
				margin: 20upx 0;
				padding: 0 25upx;
				box-sizing: border-box;
				background-color: #fff;

				.evaluate_title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 84upx;
					overflow: hidden;

					.title_name {
						font-size: 30upx;
						font-weight: bold;
					}

					.title_goto {
						font-size: 24upx;
						color: #666;

						.iconfont {
							margin-left: 10upx;
							font-size: 24upx;
						}
					}
				}

				.evaluate_con {
					padding-bottom: 20upx;
					box-sizing: border-box;
					font-size: 28upx;

					.con_title {
						image {
							width: 60upx;
							height: 60upx;
							border-radius: 50%;
						}

						.Name {
							display: inline-block;
							vertical-align: top;
							margin-top: 10upx;
							margin-left: 15upx;
						}
					}

					.con_img {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						align-items: center;
						margin-top: 20upx;

						image {
							margin-right: 20upx;
							margin-bottom: 15upx;
							width: 160upx;
							height: 160upx;
							border-radius: 5px;

							&:last-child {
								margin-right: 0;
							}
						}
					}
				}
			}

			.all-comment {
				.evaluate_list {
					background-color: #fff;
					padding: 20upx 25upx 0;
					box-sizing: border-box;

					.list_title {
						overflow: hidden;
						_zoom: 1;

						.list_left {
							image {
								width: 60upx;
								height: 60upx;
								border-radius: 50%;
							}

							.list_left_con {
								display: inline-block;
								margin-left: 10px;
								font-size: 24upx;

								.time {
									color: #999999;
									margin-top: 10upx;
								}
							}
						}
					}

					.list_text {
						font-size: 28upx;
						padding: 10px 0;
					}

					.list_img {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						align-items: center;

						image {
							margin-bottom: 15upx;
							width: 160upx;
							height: 160upx;
							border-radius: 5px;
							margin-right: 15upx;
						}
					}

					.list_btm {
						overflow: hidden;
						_zoom: 1;
						padding: 10px 0;

						.btm_left {
							float: left;
							font-size: 24upx;
							color: #666666;
						}

						.btm_right {
							float: right;
							font-size: 24upx;
							color: #666;

							.comment {
								width: 90upx;
								height: 40upx;
								line-height: 36upx;
								border-radius: 20upx;
								text-align: center;
								border: 1px solid #666;
								display: inline-block;
								margin-right: 10px;
							}

							.Give {
								width: 130upx;
								height: 40upx;
								line-height: 36upx;
								border-radius: 20upx;
								text-align: center;
								border: 1px solid #666;
								display: inline-block;
							}
						}
					}
				}
			}

			.goods-detail {
				margin: 0 0 94upx;
				padding: 0 25upx 100upx;
				box-sizing: border-box;
				background-color: #fff;

				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 84upx;
					overflow: hidden;

					.title_name {
						font-size: 30upx;
						font-weight: bold;
					}
				}

				.content {
					font-size: 0;

					image {
						width: 100%;
					}
				}
			}

			.margin-t {
				/*  #ifdef  APP-PLUS  */
				margin-top: calc(var(--status-bar-height) + 88upx);
				/*  #endif  */
				/*  #ifndef  APP-PLUS  */
				margin-top: 88upx;
				/*  #endif  */
			}

			.footer {
				position: fixed;
				bottom: 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				width: 100%;
				height: 94upx;
				background: #fff;

				.btn {
					width: 50%;
					line-height: 94upx;
					text-align: center;
					background: $theme-color;
					font-size: 34upx;
					color: #fff;

					&.buy {
						background: #fb5248;
						color: #fff;
					}
				}
			}

			.mask {
				position: fixed;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.5);
				z-index: 10008;
			}

			.mask-content {
				position: fixed;
				left: 0;
				right: 0;
				bottom: 0;
				// height: 1020upx;
				background: #fff;
				z-index: 10009;

				.header {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					padding: 0 25upx;
					box-sizing: border-box;
					height: 150upx;

					.title {
						image {
							margin-top: 0;
							position: relative;
							top: -50upx;
							width: 200upx;
							height: 200upx;
							vertical-align: middle;
						}

						text {
							margin-top: -20upx;
							margin-left: 30upx;
							color: #fb5248;
							font-size: 36upx;

							text {
								font-size: 29upx;
							}
						}
					}

					image {
						margin-top: 30upx;
						width: 40upx;
						height: 40upx;
					}
				}

				.choose-title {
					margin-top: 25upx;
					padding: 0 25upx;
					overflow: hidden;
					box-sizing: border-box;
					font-size: 28upx;
					color: #666;
					height: 20px;
				}

				.type-view {
					padding: 0 25upx;
					box-sizing: border-box;
					max-height: 150upx;

					.list {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;

						.item {
							margin-top: 18upx;
							margin-right: 24upx;
							padding: 0 32upx;
							box-sizing: border-box;
							height: 56upx;
							line-height: 56upx;
							border-radius: 28upx;
							background: #f6f5f5;
							color: #323232;
							font-size: 28upx;

							&.active {
								color: #fb5248;
								background: rgba(251, 82, 72, 0.1);
							}
						}
					}
				}

				.goods-number {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 20upx;
					margin-bottom: 120upx;
					padding: 0 25upx;
					box-sizing: border-box;
					height: 88upx;

					text {
						font-size: 28upx;
						color: #666;
					}
				}

				.choose-footer {
					position: absolute;
					bottom: 0;
					width: 100%;
					line-height: 94upx;
					color: $text-color;
					background: $theme-color;
					text-align: center;
					font-size: 34upx;
				}
			}
		}
	}
</style>
