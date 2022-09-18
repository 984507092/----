<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view class="f-item b-b" :class="[active===index?'active':'']" @click="tabActive(index)" v-for="(item,index) in cateList">
			{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside">
			<view class="s-list">
				<view class="t-list"  >
					<view class="t-item" v-for="(item,index) in cateListChildren" @click="navTo(`/pages/product/list?cate_id=${item._id}`)">
						<image :src="item.img"></image>
						<text class="s-item">{{item.name}}</text>
					</view>

				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getCate
	} from '@/utils/API/index.js'

	export default {
		name: 'cate',
		data() {
			return {
				cateList: [],
				cateListChildren:[],
				active:0
			}
		},

		onLoad() {
			this.getClassify()
		},
		methods: {
			getClassify() {
				getCate().then((res) => {
					console.log(res);
					if(res.code==1){
						this.cateList = res.data
						this.cateListChildren=this.cateList[0].children
					}
					
				}).catch((err) => {
					console.log(err);
				})
			},
			tabActive(i){
				this.active=i
				this.cateListChildren=this.cateList[i].children
			}
		}

	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}

	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;

		&.active {
			color: $base-color;
			background: #f8f8f8;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}

	.s-item {
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		image {
			width: 140upx;
			height: 140upx;
		}
	}
</style>
