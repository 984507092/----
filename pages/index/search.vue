<template>
	<view class="">

		<view class="searBtn">
			<u-search :showAction="true" placeholder='请输入搜索的名字' actionText="搜索" @search="onSearch" v-model="keyword" size="28"
				@input="onSearchInput" searchIconSize="20px" @custom="getSearch"></u-search>
		</view>
		<u-line></u-line>
		<view class="sear_record">
			<view class="search_rTit">
				<text class="search_pa">历史搜索</text>
				<text class="iconfont icon-lajitong" @click="allDete"></text>
			</view>
			<view class="search_hotBox" v-if="keyword.trim().length">

				<view class="search_delBox" v-for="(item,index) in searchResult" :key="index"
					@click="searchResultTap(item.name)">
					<text>
						{{item.name}}
					</text>
					<u-icon name="close" color="#000" size="15" @click="del(index)"></u-icon>
				</view>
			</view>
			<view class="search_hotBox" v-else>
				<view class="search_delBox" v-for="(item,index) in searchHistory" 
					:key="index">
					<text @click="historyTap(item)">
						{{item}}
					</text>
					<u-icon name="close" color="#000" size="15" @click="del(index)"></u-icon>
				</view>


			</view>
		</view>
		<cl-confirm ref="search"></cl-confirm>
	</view>
</template>

<script>
	import {
		getSearchList
	} from '@/utils/API/index.js'
	import {
		debounce
	} from './debounce.js'
	import {
		getItem,
		setItem
	} from '@/utils/accessLocal/accessLocal.js'

	export default {
		name: 'search',
		data() {
			return {
				keyword: '',
				searchResult: [],
				searchHistory: [],
				skip: 0,
				limit: 10
			}
		},
		mounted() {
			let searchHistory = getItem('searchHistory')
			if (searchHistory) {
				this.searchHistory = searchHistory || []
			}
		},
		onReachBottom() {},

		methods: {
			onSearch(e) {
				e = e.trim();
				if(e.length===0) return
				this.searchResultTap(e);
			},
			// 输入框防抖
			onSearchInput: debounce(function(val) {
				val = val.trim()
				if (val.length === 0) {
					this.searchResult = []
					return
				}

				getSearchList({
					keyword: val,
				}).then((res) => {
					console.log(res);
					if (res.code == 1) {
						this.searchResult = res.data
					}
				}).catch((err) => {
					console.log(err);
				})
			}, 800),

			// 点击搜索
			getSearch() {
				let {
					skip,
					limit,
					keyword
				} = this
				keyword = keyword.trim()
				if (keyword.length !== 0) {
					getSearchList({
						keyword,
						skip,
						limit
					}).then((res) => {
						console.log(res);
						if (res.code == 1) {
							this.total = res.count
							this.searchResult = res.data
						}
					}).catch((err) => {
						console.log(err);
					})
				} else {
					uni.showToast({
						title: '请输入标题'
					})
				}
			},

			// 保存本地
			searchResultTap(name) {
				name = name.trim()

				let index = this.searchHistory.findIndex((v) => v === name)
				if (index >= 0) {
					this.searchHistory.splice(index, 1)
				}

				this.searchHistory.unshift(name)
				setItem('searchHistory', this.searchHistory)
				uni.navigateTo({
					url: "search_list?keyword=" + name
				});
			},
			// 历史记录
			historyTap(name) {
				this.searchResultTap(name)
			},

			// 单个删除
			del(index) {
				this.searchHistory.splice(index, 1)
				setItem('searchHistory', this.searchHistory)
			},

			// 全部删除
			allDete() {
				this.searchHistory = []
				setItem('searchHistory', [])
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.searBtn {
		margin: 20rpx 20rpx;
	}

	::v-deep .u-search__content[data-v-0a306a29] {
		padding: 13rpx;
	}

	::v-deep .u-search__action--active[data-v-0a306a29] {
		background-color: #FDD100;
		padding: 10rpx;
		border-radius: 10rpx;
	}

	// /v-deep/ .uni-input{
	// 		padding: 18px;
	// 	}

	.uni-input {
		display: block;
		font-size: 16px;
		line-height: 1.4em;
		height: 1.4em;
		min-height: 1.4em;
		overflow: hidden;
		padding: 17px !important;
	}

	.u-search {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-around;

		/deep/ .u-search__input {
			width: 280px;
			margin: 0 5px;
			border: 1px solid #ccc;
			padding: 0 8px;
			border-radius: 20px;
			padding: 5px;
		}
	}


	/deep/ .cl-card__header {
		height: 0;
	}

	/deep/ .cl-card {
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .06);
		border-radius: 0;
	}

	/deep/ .u-search__action .u-search__action--active {
		background-color: $color1;
		border-color: $color1;
	}

	.sear_record {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 0 30upx;

		.search_rTit {
			width: 100%;
			height: auto;

			overflow: hidden;

			.search_pa {
				font-size: 30upx;
				color: #333;
				line-height: 80upx;
				font-weight: bold;
			}

			.iconfont {
				font-size: 36upx;
				float: right;
				line-height: 80upx;
				color: #666;
			}
		}

		.search_hotBox {
			width: 100%;
			height: auto;
			overflow: hidden;

			text {
				display: inline-block;
				font-size: 28upx;
				line-height: 45upx;
				background: #eee;
				padding: 0 30upx;
				margin-right: 20upx;
				// margin-bottom: 20upx;
				border-radius: 40upx;
			}

			.search_delBox {
				height: 80rpx;
				line-height: 80rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 10px 0;
			}
		}

		.search_delBox {
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 10px 0;
		}
	}
</style>
