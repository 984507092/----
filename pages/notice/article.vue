<template>
	<view class="page">
		<view class="yinsi_cont" v-if="content">
		<view v-for="item in content">
			<view class="yinsi_tit">
				{{item.title}}
			</view>
			<view class="time">
				{{item.add_time|fomatterDate}}
			</view>
			<view class="yinsi_box">
				<rich-text v-html="item.desc"></rich-text>
				<div>
					{{item.intro}}
				</div>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	import {
		getArticle
	} from '@/utils/API/index.js'
	import {
		fomatterDate
	} from '@/pages/user/data.js'
	export default{
		data() {
			return {
				id:'',
				content:[]
			}
		},
		onLoad(options) {
			console.log(options);
			this.id=options._id
			this.article()
		},
		filters:{
			fomatterDate
		},
		methods:{
			article(){
				getArticle({
					_id:this.id
				}).then((res)=>{
					console.log(res);
					this.content=res.data
				})
				
			}
		}
	}

</script>

<style lang="scss">
	.page {
		background: white;
		min-height: 100vh;
	}

		img{
			width: 100% !important;
		}
	.yinsi_cont {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 0 30upx;
			
		::v-deep img{
			width: 100%;
		}

		.yinsi_tit {
			font-size: 40upx;
			font-weight: bold;
			color: #333333;
			display: block;
			margin: 20rpx 0;
		}

		.yinsi_box {
			padding: 20upx 0;
			font-size: 30upx;
			color: #333;
			line-height: 56upx;
		}
	}
</style>
