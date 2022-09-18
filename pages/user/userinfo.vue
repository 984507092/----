<template>
	<view class="page-user">
		<view class="bgwhite">
			<view class="info_main">
				<view>头像</view>
				<view class="" style="width: 120upx; height: 120upx;" @click="changeUpload">
					<label for="file">
						<u-avatar :src="userInfo.avatar" size="50px"></u-avatar>
					</label>
				</view>
			</view>
			<view class="info_cont">
				<view>昵称</view>
				<input class="color999" v-model="userInfo.nickname" type="text" placeholder="输入中文或英文，1~8个字" />
			</view>
			<view class="info_cont">
				<view>性别</view>
				<text class="iconfont icon-fanhui1"></text>
				<view class="color999 uni-input" @click="sexShow = true">{{userInfo.sex||'请选择性别'}}</view>
			</view>
			<view class="info_cont">
				<view>生日</view>
				<text class="iconfont icon-fanhui1"></text>
				<view class="color999 uni-input" @click="birthdayShow=true">{{userInfo.birthday|fomatterDate}}
				</view>
			</view>
			<view class="info_cont">
				<view>所在地</view>
				<text class="iconfont icon-fanhui1"></text>
				<view class="color999 uni-input" @click="addrShow=true">{{userInfo.addr||'请选择地址'}}</view>
			</view>
			<view class="info_cont">
				<view>手机号</view>
				<text class="iconfont icon-fanhui1"></text>
				<input class="color999" type="text" v-model="userInfo.username" disabled="true" />
			</view>
		</view>
		<view class="confirm-btn" @click="userInfoBeg">确定</view>

		<!-- 性别弹出层 start -->
		<u-picker :show="sexShow" @cancel="sexShow=false" @confirm="choiceSex" :columns="columnSex"></u-picker>
		<!-- 性别弹出层 end -->

		<!-- 生日弹出层 start -->
		<u-datetime-picker :show="birthdayShow" :minDate="-628502400000" :maxDate="2556028800000" @cancel="birthdayShow=false" @confirm="birthdayChoice"
			v-model="birthdayVal" mode="date"></u-datetime-picker>
		<!-- 生日弹出层 end -->

                
		<!-- 地区弹出层 start -->
		<u-picker :show="addrShow" ref="uPicker" @cancel="addrShow=false" :columns="columnCity" @confirm="cityChoice"
			@change="changeHandler"></u-picker>
	<!-- 		<u-picker :show="addrShow" ref="uPicker" @cancel="addrShow=false"  v-show="addrShowCode" :columns="columnCityCode" @confirm="cityChoice"
				@change="changeHandler"></u-picker> -->
		<!-- 地区弹出层 end -->

	</view>

</template>

<script>
	const addCity = require('@/utils/cityName/regions.json')
	import {
		editUserInfo,
		getQiniuToken,
		uploadQiniu
	} from '@/utils/API/user.js'
	import {
		mapState
	} from "vuex"
	import {
		fomatterDate
	} from './data.js'

	export default {
		name: 'userInfo',

		data() {
			return {
				userInfo: {},
				avatar: '',
				nickname:'',
				sexShow: false,
				columnSex: [
					['男', '女', '保密']
				],
				birthdayShow: false,
				birthdayVal: Number(new Date()),
				addrShow: false,
				preIndex: 0,
				cityIndex: 0,
				areaIndex:0,
				addrShowCode:false,
				addrCode:[]
			}
		},
		computed: {
			...mapState(['uid']),
			columnCity() {
				return [addCity, this.columnData, this.columnArea].map(arr => arr.map(item => item.name))
			},
			columnData() {
				return addCity[this.preIndex].childs
			},
			columnArea() {
				return addCity[this.preIndex].childs[this.cityIndex].childs
			},
			
		},

		filters: {
			fomatterDate
		},

		watch: {
			"$store.state.userInfo": {
				immediate: true, // 正常流程进来
				handler(n, o) {
					this.userInfo = JSON.parse(JSON.stringify(n));
				},
			},
		},

		onLoad() {

		},
		methods: {
			// 性别选择
			choiceSex(e) {
				// console.log(e);
				this.userInfo.sex = e.value[0]
				this.sexShow = false
			},

			// 生日选择
			birthdayChoice(e) {
				console.log(e);
				this.birthdayVal = e.value
				// fomatterDate
				this.userInfo.birthday = this.birthdayVal
				this.birthdayShow = false
			},

			// 城市选择器
			changeHandler(e) {
				// console.log(e);
				const {
					columnIndex,
					value,
					values,
					index,
					picker = this.$refs.uPicker
				} = e
				if (columnIndex === 0) {
					this.preIndex = index
					this.cityIndex = 0
					picker.setColumnValues(1, this.columnData)
				}
				if (columnIndex === 1) {
					this.cityIndex = index
					picker.setColumnValues(2, this.columnArea)
				}
				if (columnIndex === 2) {
					this.areaIndex = index
				}

			},

			cityChoice(e) {
				this.userInfo.addr = e.value.map((v) => v).join('-')
				this.addrShow = false
				let {cityIndex,preIndex,areaIndex,columnData,columnArea} = this
				let addrCityCode=[addCity[preIndex],columnData[cityIndex],columnArea[areaIndex]]
				this.addrCode=addrCityCode.map((v)=>v.code)
			},
			// end

			// 头像上传
			changeUpload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(res.tempFiles);
						let tempFilePaths = res.tempFilePaths
						let imgArr = res.tempFiles

						let file;
						imgArr.map((v) => {
							file = v
						})

						let {
							type
						} = file
						let file_name =
							`${new Date().getTime()}_${Math.random()
							            .toString(36)
							            .slice(2)}.${type}`

						// 获取头像token
						getQiniuToken().then(({
							token
						}) => {

							uni.uploadFile({
								url: 'https://upload-z1.qiniup.com', //仅为示例，非真实的接口地址
								filePath: tempFilePaths[0],
								name: 'file',
								formData: {
									'token': token,
									"file": file,
									'key':file_name
								},
								success: (uploadFileRes) => {
									// console.log(uploadFileRes.data);
									// console.log(`http://toutiao.longxiaokj.com/` + imgPhoto.key);
									let imgPhoto=JSON.parse(uploadFileRes.data);
									// console.log(imgPhoto);
									this.userInfo.avatar=`http://toutiao.longxiaokj.com/` + imgPhoto.key
															
									uni.showLoading({
										title: '头像上传加载中'
									});
									
									setTimeout(function () {
										uni.hideLoading();
									}, 2000);
		
		
		
								}
							});

							// const formdata = new FormData();
							// formdata.append("file", file);
							// formdata.append('token', token);
							// formdata.append('key', file_name)
							// console.log(formdata);
							// let formdata = {
							// 	"file": file,
							// 	'token': token,
							// 	'key': file_name
							// }

							// uploadQiniu({
							// 	formdata
							// }).then((res) => {
							// 	console.log(res);
							// 	console.log(`http://toutiao.longxiaokj.com/` + res.key);
							// 	// this.avatar = `http://toutiao.longxiaokj.com/` + res.key
							// 	// console.log(this.avatar);
							// })
							
						})
					}
				});

			},


			// 接口
			userInfoBeg() {
				console.log(this.userInfo);
				
				let {
					nickname,
					sex,
					birthday,
					addr,
					avatar,
				} = this.userInfo
				
				editUserInfo({
					nickname,
					avatar,
					sex,
					birthday,
					addr,
					addr_code:this.addrCode,
					uid: this.uid
				}).then((res) => {
					console.log(res);
					if(res.code==1){
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})

			}
		},
	}
</script>

<style lang="scss">
	.bgwhite {
		background: #fff;
	}

	.page-user {
		width: 100%;
		height: 100%;

		.info_main {
			width: 100%;
			height: 151upx;
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			overflow: hidden;
			padding: 0 30upx;

			view {
				font-size: 30upx;
				color: #999999;
			}

			image {
				float: right;
				width: 94upx;
				height: 94upx;
				border-radius: 50%;
			}
		}

		.info_main:after {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			height: 1px;
			content: '';
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			background-color: #eeeeee;
		}

		.info_cont {
			width: 100%;
			height: 101upx;
			position: relative;
			overflow: hidden;
			padding: 0 30upx;

			view {
				font-size: 30upx;
				line-height: 101upx;
				color: #999999;
				float: left;
			}

			.txt {
				display: block;
				width: auto;
				height: 101upx;
				float: right;
				text-align: right;
				margin-right: 10upx;
				font-size: 30upx;
				width: 500upx;
			}

			.uni-input,
			input {
				display: block;
				width: auto;
				height: 101upx;
				float: right;
				text-align: right;
				margin-right: 10upx;
				font-size: 30upx;
				width: 500upx;
			}

			text {
				font-size: 14upx;
				color: #bfbfbf;
				float: right;
				line-height: 101upx;
			}

			.iconfont {
				font-size: 28upx;
			}
		}

		.uni-input-placeholder {
			color: #999;
		}

		.info_cont:after {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			height: 1px;
			content: '';
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			background-color: #eeeeee;
		}
	}

	.confirm-btn {
		width: 80%;
		height: 80upx;
		background: #fdd100;

		border-radius: 60upx;
		margin: 40upx auto;

		text-align: center;
		color: #fff;
		line-height: 80upx;
		font-size: 30upx;
	}
</style>
