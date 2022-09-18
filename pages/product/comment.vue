<template>
	<view class="content" style="border-top: 1px solid #eee;">
		<view class="goods-list" >
			<view class="eva-box" >
				<view class="eva_box_top">
					<image class="portrait" src="../../static/images/my/001.png" mode="aspectFill"></image>
					<view class="userInfo">
						<text class="name">l林逸</text>
					<text class="time">2021-01-14</text>
					</view>
					
					<view class="star">
						<text v-for="(item2,index2) in 5" class="iconfont icon-xingxing2" :class="item2<=4?'act':''"></text>
					</view>
						
				</view>
				
				<view class="right">
					
					<view class="con">很不错  还会再买的</view>
					<view class="img_wrap">
						<view class="img" >
								<image src="../../static/images/shop/goods_banner2.jpg" mode="heightFix"></image>
						</view>
					</view>
					<view class="bot">
						<text class="attr">购买类型：大包</text>
						
					</view>
				</view>
			</view>
		</view>
		

		
	</view>
</template>

<script>
	
</script>

<style lang="scss">
	page, .content{
		background:#fff;
	}

	/* 商品列表 */
	.goods-list{
		padding: 20rpx 30rpx ;
		.eva-box {
			display: flex;
			padding: 20upx 0;
			flex-wrap: wrap;
			border-bottom: 1px solid #eee;
			.eva_box_top{
				display: flex;
				width: 100%;
			}
			.portrait {
				flex-shrink: 0;
				width: 80upx;
				height: 80upx;
				border-radius: 100px;
				
			}
			.userInfo{
				display: flex;
				height: 80rpx;
				flex-direction: column;
				margin-left: 20rpx;
				justify-content: space-between;
			}
			.star{
				flex: 1;
				text-align: right;
				text{
					color: #aaa;
					&.act{
						color: #e33b2d;
					}
				}
			}
			.right {
				display: flex;
				flex-direction: column;
				font-size: $font-base;
				color: $font-color-base;
				padding-left: 100upx;
				
				.con {
					font-size: $font-base;
					color: $font-color-dark;
					padding: 20upx 0;
				}
				.img_wrap{
					display: flex;
					flex-wrap: wrap;
					
				}
				.img{
					width: 180rpx;
					height: 180rpx;
					margin-right: 30rpx;
					margin-bottom: 30rpx;
					image{
						width: 180rpx;
						height: 180rpx;
					}
					
				}
				.bot {
					display: flex;
					justify-content: space-between;
					font-size: $font-sm;
					color: $font-color-light;
				}
			}
		}
	}
	

</style>
