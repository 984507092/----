<template>
	<view class="content">
		<view class="goods-list">
			<view class="goods-item" 
			
			 >
				<cl-list-item swipe="right">
					<view class="image-wrapper"><image src="../../static/images/home/goods1.jpg" mode="widthFix"></image></view>
					<view class="price-box">
						<text class="title">加拿大原装进口 爱肯拿Acana 无谷鸭肉巴特利梨配方全犬粮 6kg</text>
						<text class="price">100</text>
					</view>
					<view class="append" slot="menu"><button type="warn"  class="error-btn">删除</button></view>
				</cl-list-item>
			</view>
		</view>
	</view>
</template>

<script>

</script>

<style lang="scss">
page,
.content {
	background: $page-color-base;
}

/* 商品列表 */
.goods-list {
	display: flex;
	flex-wrap: wrap;
	padding: 0 30upx;
	background: #fff;
	.goods-item {
		display: flex;
		padding: 20upx 0;
		border-bottom: 1px solid #eee;
	}
	.image-wrapper {
		width: 200rpx;
		height: 200rpx;
		border-radius: 3px;
		overflow: hidden;
		image {
			width: 200rpx;
			height: 200rpx;
			opacity: 1;
		}
	}
	.title {
		font-size: $font-lg;
		color: $font-color-dark;
		line-height: 50upx;
	}
	.price-box {
		font-size: 24upx;
		color: $font-color-light;
		flex: 1;
		padding-left: 10px;
		display: flex;
		flex-wrap: wrap;
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
