<template>
	<view class="page-user">
		<view class="address-list">
			<radio-group >
				<view class="addr-list" v-for="(item,index) in addrList">
					<view class="list-con">
						<view class="tops flex-row">
							<text class="name">{{item.name}}</text>
							<text class="phone">{{item.tel}}</text>
							<!-- <view class="moren-defalut" :class="item.is_default == 1 ?'':'hide'">默认</view> -->
						</view>
						<view class="address">{{item.addr_text}}{{item.detail}}</view>
						<view class="arrow"><text class="iconfont icon-fanhui1"></text></view>
					</view>
					<view class="list-btm flex-row-between">
						<view class="moren" :class="item.is_default==true?'act':'hide'" @click="tacitlyAddr(item._id,item.is_default)">
							<text class="iconfont icon-yuanquan"></text>
							默认地址
						</view>

						<view class="caozuo">
							<text class="yticon icon-bianji" style="font-size: 14px;"></text>
							<text><text class="shanchu" @click="compileAddr(item._id)">编辑</text></text>
						</view>
						<view class="caozuo">
							<text class="yticon icon-iconfontshanchu1"></text>
							<text><text class="shanchu" @click="deleAddr(item._id,index)">删除</text></text>
						</view>
					</view>
				</view>
			</radio-group>
			
		
			
		</view>
		<view class="empty act" v-if="addrList===''">
			<text class="iconfont icon-zanwushuju"></text>
			<view class="cont">您还没有收货地址</view>
		</view>
		<view class="add act" v-else @click="newlyAddr">
			<!-- <benIcon name="jiahao1" size="16" color="#C2132A"></benIcon> -->
			<text class="yticon icon-jia2"></text>
			添加收货地址
		</view>
	</view>
</template>

<script>
	import {getAddrList,delAddr,setDefaultAddr} from '@/utils/API/oederForm.js'
	import {mapState}  from 'vuex'
	export default{
		data(){
			return{
				addrList:[],

			}
		},
		computed:{
			...mapState(['uid','token'])
		},
		onLoad() {
			this.getAddr()
		},
		onShow() {
			this.getAddr()
		},
		methods:{
			// 获取地址
			getAddr(){
				let {uid,token}=this
				getAddrList({
					uid,token
				}).then(res=>{
					console.log(res);
					if(res.code==1){
						this.addrList=res.data
					}
				})
			},
			// 删除地址
			deleAddr(id,index){
				delAddr({
					uid:this.uid,
					_id:id
				}).then((res)=>{
					console.log(res);
					if(res.code==1){
						this.addrList.splice(index,1)
					}
				})
			},
			// 编辑地址
			compileAddr(id){
				uni.navigateTo({
					url:`/pages/address/addressManage?addrId=${id}`
				})
			},
			// 添加地址
			newlyAddr(){
				uni.navigateTo({
					url:'/pages/address/addressManage'
				})
			},
			// 默认地址
			tacitlyAddr(_id,is_default){
				setDefaultAddr({uid:this.uid,_id}).then((res)=>{
					console.log(res);
					if(res.code==1){
						this.getAddr()
					}
				})
			}
			
		}
	}
	
</script>

<style lang="scss">
	// .address-list .add.act[data-v-db675620]{
	// 	position: absolute;
	// 	bottom: -110%;
	// 	padding: 10px 0;
	// 	top: 0;
	// 	transform: translate(0%, -50%);
	// 	left: 50%;
	// }
	
	
page {
	background: #f6f6f6;
}

uni-radio-group {
	display: block;
	width: 750upx;
}

.address-list .addr-list .list-con .tops .moren-defalut.hide {
	display: none;
}

.address-list {
	width: 750upx;
	padding: 0 32upx 32upx;
	overflow: hidden;
	min-width: 100%;
	display: block;

	.addr-list {
		background: #fff;
		width: 690upx;
		box-shadow: 0px 10px 28px rgba(0, 0, 0, 0.08);
		display: block;
		border-radius: 16upx;
		overflow: hidden;
		box-sizing: border-box;
		margin-top: 40upx;

		.list-con {
			border-bottom: 1px solid #f5f5f7;
			padding: 22upx;
			position: relative;
			display: block;
			overflow: hidden;
			width: 690upx;

			.arrow {
				position: absolute;
				height: 80upx;
				width: 80upx;
				text-align: center;
				line-height: 80upx;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
			}

			.tops {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 0 0 20upx;
				font-size: 28upx;
				color: #333;

				.phone {
					margin-left: 20upx;
				}

				.moren-defalut {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 80upx;
					height: 40upx;
					margin-left: 40upx;
					border-radius: 30upx;
					border: 1px solid $color1;
					font-size: 26upx;
					color: $color1;
				}
			}

			.address {
				padding: 0upx 60upx 0 0;
				box-sizing: border-box;
				font-size: 28upx;
				color: #999;
			}
		}

		.list-btm {
			padding: 20upx;
			font-size: 28upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.moren {
				color: #333333;

				.iconfont {
					width: 28upx;
					height: 28upx;
					margin-right: 10upx;
					color: #999999;
					font-size: 30upx;
				}

				&.act {
					.iconfont {
						color: $color1;

						&:before {
							content: '\e67a';
						}
					}
				}
			}

			.caozuo {
				color: #333;
				display: inline-flex;
				align-items: center;
				.iconImg {
					width: 32rpx;
					height: 32rpx;
				}
				.bianji {
					display: inline-block;
					margin: 0 20upx 0 10upx;
				}

				.shanchu {
					margin-left: 10upx;
				}
			}
		}
	}

	uni-radio .uni-radio-input.uni-radio-input-checked:before {
		content: '\EA08';
	}

	.add.act {
		position: fixed;
		width: 600upx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	

		.iconfont {
			margin-right: 10upx;
		}
}
.add {
		margin: 40upx auto;
		width: 600upx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		// margin-top: 40upx;
		text-align: center;
		font-size: 28upx;
		color: $color1;
		background-color: #fff;
		border-radius: 16upx;
	}
</style>
