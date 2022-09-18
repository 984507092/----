<template>
	<view class='container'>
		<view class="wrapper">
			<view class='mui-content input-content'>
				<view class='input-item'>
					<text class="tit">姓名</text>
					<input class='minput' v-model="username||addrdetail.name" type='text' placeholder='联系人姓名'></input>
				</view>
				<view class='input-item'>
					<text class="tit">手机</text>
					<input class='minput' type='number' v-model="usertel||addrdetail.tel" placeholder='请输入联系方式'></input>
				</view>
				<view id='showCityPicker3' class='input-item' @click="showAddr=true">
					<text class="tit">地址</text>
					<input class='minput' placeholder="请选择所属区域" v-model="addr||addrdetail.addr_text" disabled="ture"></input>
					<text class="iconfont icon-fanhui1"></text>
				</view>
				<view class='input-item'>
					<textarea class="xiangxi" placeholder="请输入详细地址" v-model="textarea||addrdetail.detail" placeholder-style="color:#999;" />
				</view>
				<view class="moren">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-pd"  @click="is_default=!is_default">
							<view class="uni-list-cell-db">设为默认地址</view>
							<switch  color="#FDD100" :checked="is_default||addrdetail.is_default" class="kaiguan"/>
						</view>
					</view>
				</view>
			</view>
			<button class="confirm-btn" @click="confirmBtn">确认</button>
		</view>
		<!-- 地址 -->
		<u-picker :show="showAddr" ref="uPicker" :columns="cityAddr" @cancel="showAddr=false" @confirm="confirm"
			@change="changeHandler"></u-picker>
	</view>
</template>

<script>
	import {
		saveAddress,getAddrDetail
	} from '@/utils/API/oederForm.js'
	import {mapState} from 'vuex'
	const addCity = require('@/utils/cityName/regions.json')
	export default {
		data() {
			return {
				username: '',
				usertel: '',
				addr: '',
				textarea: '',
				showAddr: false,
				addrCode:'',
				is_default:false,
				addrId:'',
				preIndex: 0,
				cityIndex: 0,
				areaIndex:0,
					
				addrdetail:{
					name:'',
					tel:'',
					detail:'',
					addr_text:'',
					addr_id:''
				}
			}
		},
		onLoad(options) {
			this.addrId=options.addrId
			if(options.addrId){
					this.AddrDetail()
			}
		},

		computed: {
			...mapState(['uid','token']),
			cityAddr() {
				return [addCity, this.cityColumns, this.cityArea].map(arr => arr.map(item => item.name))
			},
			cityColumns() {
				return addCity[this.preIndex].childs
			},
			cityArea() {
				return addCity[this.preIndex].childs[this.cityIndex].childs
			}
		},
		methods: {
			// 地址
			changeHandler(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e
				// 当第一列值发生变化时，变化第二列(后一列)对应的选项
				if (columnIndex === 0) {
					this.preIndex = index
					this.cityIndex = 0
					picker.setColumnValues(1, this.cityColumns)
				}
				if (columnIndex === 1) {
					this.cityIndex = index
					picker.setColumnValues(2, this.cityArea)
				}

				if (columnIndex === 2) {
					this.areaIndex = index
				}
			},
			// 回调参数为包含columnIndex、value、values
			confirm(e) {
				console.log(e);
				this.addr = e.value.map((v) => v).join('-')
				this.addrdetail.addr_text= e.value.map((v) => v).join('-')
				let {cityIndex,preIndex,areaIndex,cityColumns,cityArea} = this
				let addrCityCode=[addCity[preIndex],cityColumns[cityIndex],cityArea[areaIndex]]
				this.addrCode=addrCityCode.map((v)=>v.code)
				this.showAddr = false
			},
			
			// 验证
			Reg(str){
				let telStr= /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
				return telStr.test(str)
			},
			// 接口请求
			confirmBtn() {
				if(this.addrId==''){
					let {uid,addrId:addr_id,username:name,usertel:tel,addr:addr_text,textarea:detail,addrCode:addr_code,is_default}=this
					if(!this.Reg(this.usertel)||this.usertel===''){
						uni.showToast({
							title:'手机号格式错误',
							icon:'none',
							duration: 1000
						})
						return
					}
					if(this.username===''){
						uni.showToast({
							title:'姓名不能为空',
							icon:'none',
							duration: 1000
						})
						return
					}
					if(addr_text===''){
						uni.showToast({
							title:'地址不能为空',
							icon:'none',
							duration: 1000
						})
					return
					}
					if(addr_text===''){
						uni.showToast({
							title:'地址不能为空',
							icon:'none',
							duration: 1000
						})
					return
					}
					saveAddress({
						uid,addr_id,name,tel,addr_text,detail,addr_code,is_default
					}).then((res) => {
						console.log(res);
						if(res.code==1){
							uni.showToast({
								title:res.msg,
								icon:'none',
								duration:1000
							})
						}
					})
				}else{
						let {name,tel,addr_text,detail}=this.addrdetail
						let {uid,addrCode:addr_code,addrId:addr_id,is_default}=this
					if(!this.Reg(tel)||tel===''){
						uni.showToast({
							title:'手机号格式错误',
							icon:'none',
							duration: 1000
						})
						return
					}
					if(name===''){
						uni.showToast({
							title:'姓名不能为空',
							icon:'none',
							duration: 1000
						})
						return
					}
					if(addr_text===''){
						uni.showToast({
							title:'地址不能为空',
							icon:'none',
							duration: 1000
						})
					return
					}
					if(addr_text===''){
						uni.showToast({
							title:'地址不能为空',
							icon:'none',
							duration: 1000
						})
					return
					}
					saveAddress({
						uid,addr_id,name,tel,addr_text,detail,addr_code,is_default,addrCode
					}).then((res) => {
						console.log(res);
						if(res.code==1){
							uni.showToast({
								title:res.msg,
								icon:'none',
								duration:1000
							})
						}
					})
				}
			},
			AddrDetail(){
				let {addrId:_id,uid}=this
				getAddrDetail({uid,_id}).then((res)=>{
					console.log(res);
					
						if(res.code==1){
							let arr=res.data
							
							arr.map((v)=>{
								this.addrdetail.name=v.name
								this.addrdetail.tel=v.tel
								this.addrdetail.detail=v.detail
								this.addrdetail.addr_text=v.addr_text
								this.addrdetail.is_default=v.is_default
							})
						}
				
				})
			}


		}
	}
</script>


<style lang="scss">
	.uni-input-placeholder {
		color: #999
	}

	.container {
		position: relative;
		width: 100vw;
		height: 90vh;
		overflow: hidden;
		background: #f7f7f7;
	}

	.input-content {
		background: #fff;
	}


	.input-item {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: auto;
		padding: 16upx 30upx;
		background: #fff;
		border-bottom: 1px solid #f5f5f7;

		&:last-child {
			margin-bottom: 0;
		}

		.pieckerInput {
			color: #333;
			width: calc(100% - 230upx);
			font-size: 30upx;
			display: inline-block;
			line-height: 60upx;
		}

		.xiangxi {
			width: 100%;
			height: 162upx;
			padding: 14upx 10upx;
			font-size: 30upx;
		}

		.tit {
			height: 60upx;
			line-height: 60upx;
			font-size: 30upx;
			color: $font-color-dark;
			width: 200upx
		}

		.iconfont {
			color: #999;
			line-height: 60upx;
			position: absolute;
			right: 30upx;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			flex: 1;
			width: calc(100% - 50upx);
			text-align: right;
		}

		.clear_input {
			position: absolute;
			right: 0;
			top: 10upx;
			padding: 10upx;

			.iconfont {
				font-size: 40upx;
				color: $font-color-light
			}
		}
	}

	.confirm-btn {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		border-radius: 4px;
		background: $color1;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
			border: none;
		}
	}

	.moren {
		border-top: 20upx solid #f7f7f7;
		padding: 0 30upx;
		height: 110upx;
		line-height: 90upx;
		overflow: hidden;
		font-size: 30upx;

		.uni-list-cell-db {
			float: left;
			color: #333;
		}

		.kaiguan {
			float: right;
		}
	}

	.allinfo {
		width: 100%;
		height: 100%;
		background: #fff;
	}

	.xzdz .box01 {
		width: 94%;
		height: 45px;
		border-bottom: 1px solid #f7f7f7;
		margin-left: 3%;
	}

	.xzdz .box01 input {
		width: 72%;
		height: 45px;
		float: right;
	}

	.xzdz .box01 text {
		width: 70px;
		line-height: 45px;

	}


	.xzdz .box01.mr .iconfont {
		line-height: 42px;
		font-size: 18px;
		vertical-align: middle;
	}

	.xzdz .box01.gouxuan .iconfont:before {
		color: #4499ee;
		content: "\e61e";
	}

	.allinfo .btn {
		width: 100%;
		height: 45px;
		line-height: 45px;
		background: #4499ee;
		border-radius: 0;
		position: fixed;
		bottom: 0;
		color: #fff;
		font-size: 16px;
	}

	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	uni-switch .wx-switch-input:not([class*="bg-"]),
	uni-switch .uni-switch-input:not([class*="bg-"]) {}
</style>
