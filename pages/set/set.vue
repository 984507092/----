<template>
	<view class="container">
		<view class="list-cell b-b m-t">
			<text class="cell-tit">个人资料</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b"  @click="navTo('/pages/public/edit_pwd')">
			<text class="cell-tit">修改密码</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell m-t b-b" >
			<text class="cell-tit">清除缓存</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" >
			<text class="cell-tit">关于小莱</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<!-- #ifdef APP-PLUS -->
	
		<view class="list-cell" >
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip">当前版本 1.0</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
			<!-- #endif -->
		<view class="list-cell log-out-btn" ><text class="cell-tit" @click="outLogin">退出登录</text></view>

		
	</view>
</template>

<script>
export default {
	data(){
		return{
			
		}
	},
	methods:{
		outLogin(){
			uni.clearStorage()
			this.$store.commit('outLog')
			setTimeout((v)=>{
				uni.navigateTo({
					url:'/pages/public/login'
				})
			},500)
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.list-cell {
	display: flex;
	align-items: baseline;
	padding: 20upx $page-row-spacing;
	line-height: 60upx;
	position: relative;
	background: #fff;
	justify-content: center;
	&.log-out-btn {
		margin-top: 40upx;
		.cell-tit {
			color: $uni-color-primary;
			text-align: center;
			margin-right: 0;
		}
	}
	&.cell-hover {
		background: #fafafa;
	}
	&.b-b:after {
		left: 30upx;
	}
	&.m-t {
		margin-top: 16upx;
	}
	.cell-more {
		align-self: baseline;
		font-size: $font-lg;
		color: $font-color-light;
		margin-left: 10upx;
	}
	.cell-tit {
		flex: 1;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 10upx;
	}
	.cell-tip {
		font-size: $font-base;
		color: $font-color-light;
	}
	switch {
		transform: translateX(16upx) scale(0.84);
	}
}
</style>
