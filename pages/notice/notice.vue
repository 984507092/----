<template>
	<view>
		<view class="notice-item" v-for="item in content" @click="navTo(`/pages/notice/article?_id=${item._id}`)">
			<text class="time">{{item.add_time|fomatterDate}}</text>
			<view class="content">
				<text class="title"> {{item.title}}</text>
				<text class="introduce">
					{{item.intro}}
				</text>
				<view class="bot b-t">
					<text>查看详情</text>
					<text class="more-icon yticon icon-you"></text>
				</view>
			</view>
		</view>
		<uni-load-more :status="status"></uni-load-more>
	</view>
</template>


<script>
	import {
		getArticleList
	} from '@/utils/API/index.js'
	import {
		fomatterDate
	} from '@/pages/user/data.js'
	export default {
		data() {
			return {
				skip: 0,
				limit: 10,
				content: [],
				status: 'more',
				count: 0
			}
		},
		onLoad() {
			this.atlice()
		},
		filters: {
			fomatterDate
		},
		// 上拉加载
		onReachBottom() {
			let allTotal = this.content.length
			if (allTotal <= this.count) {
				this.status = 'loading'
				this.skip++
				this.atlice()

			} else {
				this.status = 'noMore'
				uni.showToast({
					title: '获取完毕',
					duration: 500,
					success: (res) => {
						console.log(res);
					}
				});
			}
		},
		methods: {
			atlice() {
				let {
					skip,
					limit
				} = this
				getArticleList({
					skip,
					limit
				}).then((res) => {
					console.log(res);
					if (res.code == 1) {
						this.count = res.count
						this.content.push(...res.data)
					}

				})
			},
		},


	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}
</style>
