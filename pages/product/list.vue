<template>
	<view class="content">
		<view class="navbar">
			<view class="nav-item" :class="{current:sort_type===1}" @click="ranking(1)">
				综合排序
			</view>
			<view class="nav-item" :class="{current:sort_type===2}" @click="ranking(2)">
				销量优先
			</view>
			<view class="nav-item :class='{current:sort_type==3}||{current:sort_type==4}'" >
				<text>价格</text>
				<view class="p-box" @click="priceUp">
					<text class="yticon icon-shang active" v-if="isPrice"></text>
					<text class="yticon icon-shang xia" v-else></text>
				</view>
			</view>
		</view>
		<view class="goods-list">
			<view class="goods-item" v-for="item in cateGoodList" @click="navTo(`/pages/product/product?goods_id=${item._id}`)">
				<view class="image-wrapper">
					<image :src="item.img" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.name}}</text>
				<view class="price-box">
					<text class="price">{{item.price}}</text>
					<text>已售 {{item.sales}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getGoodList
	} from '@/utils/API/good.js'
	export default {
		name: 'goodList',
		data() {
			return {
				cate_id: '',
				skip: 0,
				limit: 10,
				sort_type: 1,
				is_top: null,
				cateGoodList: [],
				isPrice:true,
				
			}
		},
		onLoad(options) {
			console.log(options);

			this.cate_id = options.cate_id
			this.is_top = options.is_top
			this.goodList()
		},
		onPullDownRefresh() {
			this.cateGoodList = []
			this.goodList()
			setTimeout(() => {
				//结束下拉刷新
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			goodList() {
				let {
					cate_id,
					skip,
					limit,
					sort_type,
					is_top
				} = this
				getGoodList({
					cate_id,
					skip,
					limit,
					sort_type,
					is_top
				}).then((res) => {
					console.log(res);
					this.cateGoodList = res.data
				})
			},
			ranking(n) {
				switch(n){
					case 1:
					this.sort_type = 1
					this.cateGoodList = []
					this.goodList()
					break
					case 2:
					this.sort_type = 2
					this.cateGoodList = []
					this.goodList()
					break

				}
			},
			priceUp() {
				if(this.isPrice){
					this.isPrice=false
					this.sort_type = 3
					this.cateGoodList = []
					this.goodList()
				}else{
					this.isPrice=true
					this.sort_type = 4
					this.cateGoodList = []
					this.goodList()
				}
			
			}
		}
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 96upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 630upx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}

		.active {
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}
</style>
