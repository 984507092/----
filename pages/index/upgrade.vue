<template>
	<view class="upgrade">
		<view class="progress-box" >
			<view class="tips">正在下载资源包,请勿退出</view>
			<cl-progress color="#67C23A" :value="percent"></cl-progress>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			percent: 20
		};
	}
	
};
</script>

<style>
.upgrade {
	height: calc(100vh - var(--status-bar-height));
	background: #fff;
	width: 750rpx;
	position: relative;
	padding: 0 25rpx;
}
.progress-box{
	
	width: 100%;
	position: absolute;
	top: calc(50% - 120px);
	
}

.tips {
	text-align: center;
	color: #333;
	margin: 20px 0;
}
</style>
