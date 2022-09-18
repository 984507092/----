<template>
	<scroll-view scroll-y class="container">
		<view class="content-wrap">
			<view class="content-item">
				<view class="goods">
					<uni-swipe-action>
						<uni-swipe-action-item :right-options="options" @click="dele(item._id,index)"
							v-for="(item,index) in shopList">
							<view class="swipe-action u-border-top u-border-bottom">
								<view class="swipe-action__content">
									<label :class="item.checked?'act':''">
										<text class="iconfont icon-danxuan-weixuan"
											@click="deselect(item._id,item.checked,index)"></text>
										<!-- <checkbox :value="item.value" @chang="" :checked="item.checked" /> -->
									</label>
									<view class="good">
										<view class="img-wrapper">
											<image :src="item.img" mode=""></image>
										</view>
										<view class="good-content">
											<view class="good-title text-line">{{item.name}}</view>
											<view class="spec">
												<view class="spec1"><text class="name ellipsis">{{item.attr}}</text>
												</view>
											</view>
											<view class="good-desc">
												<view class="good-price">
													<text>￥</text>
													{{item.price}}
												</view>
												<number-box :min="1" :source="'cart'" :max="999" :value="item.num"
													:index='index' @reduce="reduce(item._id,item.num)"
													@plus="add(item._id,item.num)" :step="1" @change="numberChange">
												</number-box>
											</view>
										</view>
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
					</u-swipe-action>
				</view>
			</view>
		</view>
		<view class="total-wrap">
			<view class="total-left">
				<label :class="checked?'act':''">
					<text class="iconfont icon-danxuan-weixuan" @click="checkAll"></text>
					全选
				</label>

				<view class="total-con">
					<view class="top-con">
						合计:
						<text class="symbol">￥</text>
						<text class="total">{{total}}</text>
					</view>
				</view>
			</view>
			<view class="total-right" @click="jumpCreate">购买</view>
		</view>
	</scroll-view>

</template>

<script>
	import numberBox from '@/components/numberbox/numberbox.vue';
	import {
		mapState
	} from 'vuex'
	import {
		getCartList,
		changeCartNum,
		toggleCheckCart,
		cancelCheckCart,
		removeCart
	} from '@/utils/API/good.js'
	export default {
		components: {
			numberBox
		},
		data() {
			return {
				shopList: [],
				NumVal: 0,
				checked: true,
				options: [{
					text: '删除',
					style: {
						backgroundColor: 'red'
					}
				}],
				cartId:[]
			};
		},
		onLoad() {
			this.numberChange()
		},
		onShow() {
			this.numberChange()
		},
		computed: {
			...mapState(['uid']),
			// 获取总价
			total() {
				return this.shopList.filter(item => item.checked).reduce((t, item2) => (t += item2.price * item2.num), 0)
					.toFixed(2)
			},
		},
		

		methods: {
			jumpCreate() {
			   let GoodsArr = [];
			   this.shopList.forEach(v => {
			    if (v.checked) {
			       GoodsArr.push(v._id);
			    }
			   });
			   console.log(GoodsArr.length);
			   if (GoodsArr.length == 0) {
			    uni.showToast({
			     title: '请至少选择一个商品',
			     duration: 1000,
			     icon: 'none'
			    });
			   } else {
			    uni.navigateTo({
			     url: `/pages/order/createOrder?GoodsArr=${GoodsArr}`
			    });
			   }
			  },
			
			
			// 删除
			dele(id, index) {
				removeCart({
					_id: id
				}).then((res) => {
					console.log(res);
					if (res.code == 1) {
						this.shopList.splice(index, 1)
					}
				})
			},

			// 请求
			numberChange(v) {
				this.NumVal = v
				// console.log(v)
				this.cartId=[]
				let {
					uid
				} = this
				
				uni.showLoading({
					title: '加载中'
				})
				
				getCartList({
					uid
				}).then((res) => {
					console.log(res);
					if (res.code == 1) {
						this.shopList = res.data
					
						if (this.shopList.length === 0) {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								deselect: 1000
							})
							this.checked = false

						} else {
						
							this.shopList.forEach((v) => {
								if (v.checked === false) {
									this.checked = false
									return
								}else{
									this.checked = true
								}
							})
							
							
						}

						setTimeout(function() {
							uni.hideLoading();
						});

					}
				})
			},
			// 加
			add(a, val) {
				// this.NumVal=val
				changeCartNum({
					_id: a,
					num: this.NumVal.value
				}).then((res) => {
					console.log(res);
					// console.log(this.NumVal.value);

					// this.numberChange()
				})
			},
			// 减
			reduce(a, val) {
				// this.NumVal=val
				console.log(this.NumVal.value);
				changeCartNum({
					_id: a,
					num: this.NumVal.value
				}).then((res) => {
					console.log(res);

					this.numberChange()
				})
			},

			// 单选
			deselect(id, checked, index) {

				if (checked == false) {
					toggleCheckCart({
						_id: id,
					}).then((res) => {
						console.log(res);
						if (res.code == 1) {
							this.shopList[index].checked = !this.shopList[index].checked
							for (const i in this.shopList) {
								let element = this.shopList[i]

								if (element.checked == false) {
									this.checked = false
									return
								} else {
									this.checked = true
									this.numberChange()
								}
							}

						}
					})
				} else {
					cancelCheckCart({
						_id: id,
					}).then((res) => {
						console.log(res);
						if (res.code == 1) {
							this.shopList[index].checked = !this.shopList[index].checked
							for (const i in this.shopList) {
								let element = this.shopList[i]

								if (element.checked == false) {
									this.checked = false
									return
								} else {
									
									this.checked = true
								}
							}

						}
					})

				}
			},
			// 全选
			checkAll() {
				let goodId = [] //接受循环出来的id
				this.shopList.map((arr) => goodId.push(arr._id))
				this.checked = !this.checked; //data定义的数据 进行开关操作
				console.log(this.checked);
				if (this.checked) { //判断
					toggleCheckCart({ //调接口
						_id: goodId,
					}).then((res) => {
						console.log(res);
						this.shopList.map((item) => {
							item.checked = true
						}) //循环把所有的都变true
						
					})
				} else {
					cancelCheckCart({ //调接口
						_id: goodId,
					}).then((res) => {
						console.log(res);
						this.shopList.map((item) => item.checked = false) //循环把所有的都变false
					})
				}

			},

		}

	};
</script>

<style lang="scss">
	.u-page {
		padding: 0;
	}

	.u-demo-block__title {
		padding: 10px 0 2px 15px;
	}

	.swipe-action {
		&__content {
			padding: 25rpx 0;
			display: flex;
			align-items: center;

			&__text {
				font-size: 15px;
				color: $u-main-color;
				padding-left: 30rpx;
			}
		}
	}

	.uni-label-pointer {
		line-height: 0;
	}

	::v-deep .u-swipe-action-item__right__button__wrapper {
		background-color: red !important;
	}


	page {
		width: 100%;
		height: calc(100% - 110upx);
		background: #f5f5f5;

		.container {
			width: 100%;
			height: 100%;
			overflow: hidden;

			.header {
				position: relative;
				width: 100%;
				height: 360upx;
				background: #fc7827;
				background-size: cover;
				overflow: hidden;
				/*  #ifndef  APP-PLUS  */
				height: 280upx;
				background-size: 100% 100%;

				/*  #endif  */
				.title-contents {
					position: fixed;
					top: 0;
					width: 100%;
					height: calc(var(--status-bar-height) + 88upx);
					z-index: 100008;

					.top-view {
						width: 100%;
						height: var(--status-bar-height);
						background: #fc7827;
					}

					.titles {
						display: flex;
						flex-direction: row;
						height: 88upx;
						background: #fc7827;

						.titleLeftButton {
							width: 88upx;
							height: 88upx;
							line-height: 88upx;
							text-align: center;

							image {
								width: 40upx;
								height: 40upx;
							}
						}

						.titleText {
							width: 574upx;
							line-height: 88upx;
							text-align: center;
							font-size: 36upx;
							color: #fff;
						}

						.titleRightButton {
							width: 88upx;
							height: 88upx;
							line-height: 88upx;
							text-align: center;
							font-size: 32upx;
							color: #fff;
						}
					}
				}
			}

			.content-wrap {
				margin-top: 20upx;
				margin-left: 24upx;
				width: 702upx;

				//
				.content-item {
					margin-bottom: 20upx;
					border-radius: 20upx;
					background: #fff;
				}

				.goods {
					display: flex;
					justify-content: space-between;
					margin-bottom: 20upx;

					&:last-child {
						margin-top: 0;
					}

					label {
						margin-left: 20upx;
						line-height: 214upx;

						.iconfont {
							font-size: 46upx;
							color: #bbb;
						}

						&.act .iconfont {
							color: $theme-color;

							&::before {
								content: '\e617';
							}
						}
					}

					.good {
						display: flex;
						justify-content: space-between;
						width: 624upx;
						padding: 20upx 0 0;
						box-sizing: border-box;
						border-bottom: 1px solid #eee;

						.img-wrapper {
							width: 180upx;
							height: 180upx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.good-content {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							width: 440upx;
							height: 180upx;
							padding: 0 20upx;
							box-sizing: border-box;

							.good-title {
								font-size: 28upx;
								color: #111;
							}

							.spec {
								display: flex;
								flex-direction: row;

								.spec1 {
									display: flex;
									flex-direction: row;
									align-items: center;
									padding: 0 16upx;
									box-sizing: border-box;
									width: 100%;
									height: 40upx;
									border-radius: 8upx;
									//

									.name {
										display: inline-block;
										// width: 85%;
										padding: 0 15upx;
										line-height: 40upx;
										font-size: 24upx;
										color: #666;
										background: #f6f6f6;
									}

									.iconfont {
										color: #999;
									}
								}
							}

							.good-desc {
								display: flex;
								justify-content: space-between;

								.good-price {
									line-height: 38upx;
									color: #fb5248;
									font-size: 30upx;
								}
							}
						}
					}
				}
			}

			.total-wrap {
				position: fixed;
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 100upx;
				line-height: 100upx;
				background: #fff;
				z-index: 9;
				/*  #ifndef  H5  */
				bottom: 0px;
				/*  #endif  */
				/*  #ifdef  H5  */
				bottom: 50px;
				/*  #endif  */

				.total-left {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					padding-left: 20upx;
					width: 490upx;
					height: 100%;
					color: #333;
					box-sizing: border-box;

					label {
						font-size: 28upx;
						display: flex;
						align-items: center;

						.iconfont {
							font-size: 46upx;
							color: #bbb;
							margin-right: 5px;
						}

						&.act .iconfont {
							color: $theme-color;

							&::before {
								content: '\e617';
							}
						}
					}

					.total-con {
						display: flex;
						flex-direction: column;
						margin-right: 20upx;

						.top-con {
							display: flex;
							flex-direction: row;
							line-height: 100upx;
							font-size: 30upx;
							color: #333;

							.freight {
								margin-right: 16upx;
								font-size: 22upx;
								color: #999;
							}

							.symbol {
								font-size: 24upx;
								color: #fc511f;
							}

							.total {
								color: #fc511f;
							}
						}

						.bottom-con {
							display: flex;
							flex-direction: row;
							line-height: 36upx;
							font-size: 22upx;

							.discounts {
								color: #fb5248;
								margin-right: 16upx;
							}

							.detail {
								color: #666;
							}

							.iconfont {
								font-size: 14px;
							}
						}
					}
				}

				.total-right {
					width: 200upx;
					height: 80upx;
					line-height: 80upx;
					margin-top: 10upx;
					margin-right: 20upx;
					background: #fc511f;
					color: #fff;
					text-align: center;
					font-size: 28upx;
					border-radius: 40upx;
				}
			}

			.mask {
				position: fixed;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.5);
				z-index: 10009;
			}

			.mask-content {
				position: fixed;
				left: 0;
				right: 0;
				bottom: 0;
				height: 510upx;
				background: #fff;
				z-index: 10009;

				.head {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 0 25upx;
					box-sizing: border-box;
					height: 110upx;

					.title {
						position: relative;
						padding-left: 20upx;
						box-sizing: border-box;
						line-height: 110upx;
						font-size: 32upx;
						color: #010101;
						font-weight: bold;

						&::before {
							position: absolute;
							left: 0;
							top: 40upx;
							content: ' ';
							width: 6upx;
							height: 30upx;
							background: blue;
						}

						text {
							margin-left: 20upx;
							font-weight: normal;
							font-size: 24upx;
							color: #666;
						}
					}

					image {
						width: 30upx;
						height: 30upx;
					}
				}

				.holder {
					color: #999;
				}

				.list {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					margin: 0 auto;
					width: 700upx;
					height: 70upx;

					// border-bottom: 1px solid #eee;
					text {
						font-size: 28upx;
						color: blue;

						text {
							margin-left: 20upx;
							font-size: 24upx;
							color: #666;
						}
					}
				}

				.footer {
					position: absolute;
					bottom: 0;
					width: 100%;
					line-height: 94upx;
					color: blue;
					background: blue;
					text-align: center;
					font-size: 34upx;
				}
			}
		}
	}
</style>
