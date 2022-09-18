<template>
	<view class="">
		<scroll-view scroll-y="true"  class="container" @scroll="pageScroll">
		
			<view class="header" :class="headerActive?'act':''">
				<view class="title-contents">
					<!--  #ifdef APP-PLUS||MP -->
					<view class="top-view status"></view>
					<!--  #endif -->
					<view class="_top titles">
						<view class="input-wrapper" @click="navTo('/pages/index/search')">
							<image src="/static/images/home/search.png" mode=""></image>
							<input type="text" disabled="disabled" placeholder="搜索商品" />
						</view>
						<view class="titleRightButton" @click="navTo('/pages/notice/notice')">
							<text class="iconfont icon-xitongtongzhi"></text>
						</view>
					</view>
				</view>
			</view>
		
			<view class="swiper-wrapper">
				<swiper indicator-dots="true" indicator-color="#666" indicator-active-color="#fff" autoplay="true"
					circular="true">
					<swiper-item v-for="item in banner" :key="item._id">
						<image :src="item.img" />
					</swiper-item>
		
				</swiper>
			</view>
			<view class="menu">
				<view class="nav-wrapper">
					<view class="nav" v-for="item in cate" :key="item._id" @click="navTo(`/pages/product/list?cate_id=${item._id}&is_top=${1}`)">
						<view class="img-wrapper">
							<image :src="item.img" />
						</view>
						<text class="text">{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- 		<view class="time-buy">
				<view class="title">
					<view class="title-con">
						<text class="text">限时抢购</text>
						<view class="count-down">
							<text>00</text>:
							<text>24</text>:
							<text>29</text>
						</view>
					</view>
					<view class="more" @click="gotoSeckill">
						<text>更多</text>
						<image src="/static/images/common/arrow.png"></image>
					</view>
				</view>
				<view class="goods-list">
					<view class="goods" v-for="(item, index) in '123'" :key="index">
						<view class="img-wrapper">
							<image src="/static/images/home/goods01.png"></image>
						</view>
						<view class="seckill-title">
							<image src="/static/images/shop/seckill.png" mode=""></image>
							<text>限时特价</text>
						</view>
					</view>
				</view>
			</view> -->
			<view class="rank">
				<view class="title">推荐榜单</view>
				<u-scroll-list>
					<view class="rank-list">
						<view class="rank-item" @click="navTo(`/pages/product/product?goods_id=${item._id}`)" v-for="(item,index) in omnibus"
							:key="index">
							<view class="img-wrapper">
								<image :src="item.img"></image>
							</view>
							<view class="rank-title">
								<image src="/static/images/home/rank.png" mode=""></image>
								<text>{{item.name}}</text>
							</view>
						</view>
					</view>
				</u-scroll-list>
			</view>
			<view class="like">
				<view class="title">猜你喜欢</view>
				<view class="list">
					<view class="goods-item" v-for="(item,index) in  GuessYou" :key="index" @click="navTo(`/pages/product/product?goods_id=${item._id}`)">
						<view class="img-wrapper">
							<image :src="item.img"></image>
						</view>
						<view class="goods-content">
							<view class="goods-title text-line">
								{{item.name}}
							</view>
							<view class="goods-desc">
								<view class="goods-price">
									<text class="symbol">￥</text>
									<text class="price">{{item.price}}</text>
								</view>
								<view class="sales">
									<text>已售{{item.sales}}件</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="status"></uni-load-more>
		</scroll-view>
	</view>
</template>
<script>
	import {
		getBanner,
		getCate,
		getCompetitive,
		getLike,
		getArticleList
	} from '@/utils/API/index.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				headerActive: false,
				banner: [], //海报
				cate: [], //分类
				omnibus: [], //精选
				skip: 0, //分页
				limit: 10, //返回数据几条
				GuessYou: [], //猜你喜欢,
				count:null,
				status:'more'
			}
		},
		onLoad() {
			this.getBannerPhoto() //海报
			this.getSort() //分类
			this.recommend() //推荐
			this.guessYouLike() //猜你喜欢
			// uni.startPullDownRefresh() //页面开始调用下拉刷新
		},
		// 
		onShow() {
			// uni.startPullDownRefresh() //页面切换回来后开始调用下拉刷新
		},
		// 上拉加载
		onReachBottom() {
			let allTotal = this.GuessYou.length
			if (allTotal <= this.count) {
				this.status = 'loading'
				this.skip+=10 
				this.guessYouLike()
				
			} else {
			this.status='noMore'
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
			this.GuessYou = []
			this.omnibus=[]
			this.recommend()
			this.guessYouLike()
			setTimeout(() => {
				//结束下拉刷新
				uni.stopPullDownRefresh()
			}, 1000)
		},
		
		methods: {
			//监控页面滚动,控制头部变色
			pageScroll(e) {
				this.headerActive = e.target.scrollTop >= 40;
			},

			// 获取banner
			getBannerPhoto() {
				uni.showLoading({
				            title: "加载中"
				});
			
				getBanner().then((res) => {
					console.log(res);
					if (res.code == 1) {
						uni.hideLoading();
						this.banner = res.data
					}
				}).catch((err) => {
					console.log(err);
				})
			},

			// 获取分类
			getSort() {
				getCate({
					position: 'index'
				}).then((res) => {
					console.log(res);
					if (res.code == 1) {
						this.cate = res.data
					}
				})
			},

			// 推荐榜单
			recommend() {
				let {
					limit,
					skip,

				} = this
				getCompetitive({
					limit,
					skip
				}).then((res) => {
					console.log(res);
					if (res.code == 1) {
						// total = res.count
						this.omnibus = res.data
					} else {
						console.log('请求数据失败');
					}
				}).catch((err) => {
					console.log(err);
				})
			},

			//猜你喜欢
			guessYouLike() {

				getLike({
					skip:this.skip,
					limit:this.limit
				}).then((res) => {
					console.log(res);
					if (res.code == 1) {
						this.count = res.count
						this.GuessYou.push(...res.data)
					}
				}).catch((err) => {
					console.log(err);
				})

			}
		},
	

	}
</script>


<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background: $page-background;

		.container {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0);

			.header {
				position: fixed;
				top: 0;
				width: 100%;
				height: calc(var(--status-bar-height) + 88upx);
				background: rgba(255, 255, 255, 0);
				overflow: hidden;
				z-index: 999;

				&.act {
					background: rgba(253, 209, 0, .8);

					.title-contents .titles .titleRightButton .iconfont {
						color: #fff;
					}

				}

				.title-contents {

					width: 100%;
					height: calc(var(--status-bar-height) + 88upx);
					z-index: 100008;

					.top-view {
						width: 100%;
						height: var(--status-bar-height);
					}

					.titles {
						display: flex;
						flex-direction: row;
						height: 88upx;
						/* #ifdef MP */
						width: 550upx;
						/* #endif */

						.input-wrapper {
							display: flex;
							flex-direction: row;
							align-items: center;
							margin-top: 12upx;
							margin-left: 24upx;
							width: 702upx;
							height: 64upx;
							background: #fff;
							border-radius: 32upx;
							/* #ifdef MP */
							order: 1;

							/* #endif */
							image {
								margin: 0 15upx 0 28upx;
								width: 26upx;
								height: 26upx;
							}

							input {
								flex: 1;
								font-size: 28upx;
								color: #666;
							}
						}

						.titleRightButton {
							width: 88upx;
							height: 88upx;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-left: 5px;

							.iconfont {
								font-size: 50upx;
								color: rgba(248, 84, 78, .8);
							}
						}
					}
				}

			}

			.swiper-wrapper {
				position: relative;
				margin-top: calc(var(--status-bar-height) - 88upx);
				width: 750upx;
				height: 509upx;

				swiper {
					width: 750upx;
					height: 509upx;

					image {
						width: 750upx;
						height: 509upx;
					}
				}
			}

			.time-buy {
				margin: 20upx auto 0;
				width: 702upx;
				background: #fff;

				.title {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 0 20upx;
					height: 90upx;

					.title-con {
						display: flex;
						flex-direction: row;
						align-items: center;

						.text {
							font-size: 32upx;
							color: #333;
							font-weight: bold;
						}

						.count-down {
							margin-left: 20upx;
							font-size: 28upx;

							text {
								margin: 0 4upx;
								padding: 2upx 8upx;
								font-size: 24upx;
								color: #fff;
								background: #FB5248;
							}
						}
					}

					.more {
						display: flex;
						flex-direction: row;
						align-items: center;

						text {
							font-size: 24upx;
							color: #040000;
							line-height: 24upx;
							vertical-align: middle;
						}

						image {
							margin-left: 20upx;
							width: 12upx;
							height: 20upx;
						}
					}
				}

				.goods-list {
					display: flex;
					flex-direction: row;
					// justify-content: space-between;
					padding: 0 20upx;
					box-sizing: border-box;

					.goods {
						margin-right: 16upx;
						width: 210upx;
						height: auto;

						.img-wrapper {
							width: 210upx;
							height: 210upx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.seckill-title {
							display: flex;
							flex-direction: row;
							align-items: center;
							height: 30upx;
							margin: 22upx 0;

							image {
								margin: 0 10upx;
								width: 28upx;
								height: 28upx;
							}

							text {
								vertical-align: middle;
								font-size: 28upx;
								color: $text-color;
							}
						}
					}
				}
			}

			.rank {
				margin: 20upx auto 0;
				width: 702upx;

				.title {
					display: flex;
					flex-direction: row;
					align-items: center;
					height: 90upx;
					font-size: 32upx;
					color: #333;
					font-weight: bold;
				}

				.rank-list {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					box-sizing: border-box;
					overflow-x: scroll;
					scroll-margin-top: 20rpx;

					.rank-item {
						width: 224upx;
						height: auto;

						.img-wrapper {
							width: 224upx;
							height: 224upx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.rank-title {
							display: flex;
							flex-direction: row;
							align-items: center;
							// height: 30upx;
							margin: 22upx 0;

							image {
								margin: 0 10upx;
								width: 28upx;
								height: 28upx;
							}

							text {
								vertical-align: middle;
								font-size: 28upx;
								color: $text-color;
							}
						}
					}
				}
			}

			.like {
				margin: 0 auto 0;
				width: 702upx;

				.title {
					display: flex;
					flex-direction: row;
					align-items: center;
					height: 90upx;
					font-size: 32upx;
					color: #333;
					font-weight: bold;
				}
			}
		}

		.menu {
			position: relative;
			z-index: 99;
			width: 702upx;
			margin: 40upx auto 0;
			padding: 16upx 0;
			background: #fff;
			border-radius: 12upx;
			overflow: hidden;

			.nav-wrapper {
				display: flex;
				flex-wrap: wrap;

				.nav {
					width: 25%;
					margin: 16upx 0;
					text-align: center;

					.img-wrapper {
						position: relative;
						width: 78upx;
						height: 78upx;
						margin: 0 auto 10upx;
						overflow: hidden;

						image {
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
						}
					}

					.text {
						margin: 0;
						font-size: 24upx;
						color: #111;
					}
				}
			}
		}

		.list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			width: 100%;

			.goods-item {
				display: flex;
				flex-direction: column;
				margin-bottom: 20upx;
				width: 48.5%;
				height: 520upx;
				background: #fff;

				&:nth-child(2n) {
					margin-left: 3%;
				}

				.img-wrapper {
					position: relative;
					width: 100%;
					height: 0;
					padding-bottom: 100%;

					image {
						position: absolute;
						width: 100%;
						height: 100%;
					}
				}

				.goods-content {
					display: flex;
					flex-direction: column;
					padding: 0 20upx;
					height: 180upx;
					box-sizing: border-box;

					.goods-title {
						margin-top: 10upx;
						width: 100%;
						height: 72upx;
						font-size: 28upx;
						color: $text-color;
					}

					.goods-desc {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						margin-top: 10upx;
						line-height: 60upx;

						.goods-price {
							.symbol {
								font-size: 22upx;
								color: #F8544E;
							}

							.price {
								font-size: 30upx;
								color: #F8544E;
							}
						}

						.sales {
							line-height: 60upx;
							font-size: 20upx;
							color: #999999;
						}

						.collect {
							line-height: 60upx;
							font-size: 20upx;
							color: #999999;

							.iconfont {
								margin-right: 10upx;
								font-size: 30upx;
								vertical-align: middle;
							}
						}

						.cart {
							image {
								margin-top: 8upx;
								width: 54upx;
								height: 54upx;
							}
						}
					}
				}
			}
		}
	}
</style>
