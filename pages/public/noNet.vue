<template>
	<view class="container">
		<view class="netless">
			<text class="iconfont icon-duanwang"></text>  
			<view class="p">您好像处于离线状态,请重试</view>
			<view class="btn" >点击重试</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss">
	page{
		width: 100vw;
		height: 100vh;
		background: #fff;
	}
	.container {
		min-height: 100vh;
		background: #fff;
	}

	.netless {
		text-align: center;
		margin-top: 120px
	}

	.netless .p {
		padding: 30px 10px;
		font-size: 14px;
		color: #888;
	}

	.netless .btn {
		display: inline-block;
		height: 68upx;
		width: auto;
		padding: 0 28px;
		color: $color1;
		border-radius: 8px;
		line-height: 68upx;
		font-size: 28upx;
		transition: all 0.3s;
		opacity: 0.9;
		border: 1px solid $color1
	}

	.netless .btn:active {
		transition: all 0.3s;
		opacity: 1;
	}

	.icon-duanwang {
		font-size: 140upx;
		color: $color1;
	}
</style>
