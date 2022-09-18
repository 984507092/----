<template>
	<view class="warp">
		<!-- #ifdef APP-PLUS -->
		<view class="title-contents">
			<view class="top-view status"></view>
		</view>
		<!-- #endif -->
		<!-- 密码登录 -->
		<view class="login-phone form-wapper">
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-shouji"></text></view>
				<view class="mobile rside">
					<input placeholder-class="input-placeholder" @input="getphone" v-model="username" type="number"
						placeholder="请输入手机号" />
					<text v-if="forgetTelText" :style="{color:forgetColor}">{{forgetTelText}}</text>
				</view>
			</view>
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-yanzhengma"></text></view>
				<view class="mobile rside">
					<input placeholder-class="input-placeholder" type="number" v-model="vercode" placeholder="请输入验证码" />
				</view>

				<view>
					<button type="default" @click="askVerCode" :style="{backgroundColor:forgetVercolor}"
						:disabled="disabled">{{forgetVercoder}}</button>
				</view>
			</view>
			<view class="code input-wapper">
				<view class="lside"><text class="iconfont icon-mima2"></text></view>
				<view class="rside">
					<input placeholder-class="input-placeholder" @input="getPass" type="password" v-model="password"
						maxlength="12" placeholder="请设置新密码(6-12位) " />
					<text v-if="forgetPasText" :style="{color:forgetPasTextColor}">{{forgetPasText}}</text>
				</view>
			</view>
		</view>

		<button type="primary" class="login-btn" @click="askForget">确定</button>
	</view>
</template>
<script>
	import {
		forget,
		begCode
	} from '@/utils/API/api.js'
	import {
		mobileTel,
		passwordReg
	} from '@/common/Validate/Validate.js'

	export default {
		name: 'forget',
		data() {
			return {
				username: '',
				password: '',
				vercode: '',
				forgetColor: '',
				forgetPasTextColor: '',
				forgetTelText: '',
				forgetPasText: '',
				disabled: false,
				forgetVercolor: '#FDDA33',
				forgetVercoder: '获取验证码'
			}
		},
		onLoad() {
			// let {username,}=this

		},

		methods: {

			getphone() {
				let data = {
					username: this.username,
					telText: this.forgetTelText,
					telColor: this.forgetColor
				}
				this.forgetTelText = mobileTel(data).telText
				this.forgetColor = mobileTel(data).telColor
			},

			getPass() {
				let data = {
					password: this.password,
					passText: this.forgetPasText,
					passTextColor: this.forgetPasTextColor
				}
				this.forgetPasText = passwordReg(data).passText
				this.forgetPasTextColor = passwordReg(data).passTextColor
			},

			askForget() {

				let {
					username,
					password,
					vercode
				} = this

				if (username == '' && password == '') {
					this.forgetTelText = '请输入手机号'
					this.forgetColor = 'red'
					this.forgetPasText = '请输入密码'
					this.forgetPasTextColor = 'red'
					return
				}

				forget({
					username,
					password,
					vercode
				}).then((res) => {
					console.log(res);
					uni.showToast({
						title: '修改成功',
						duration: 500,
						success: (res) => {
							console.log(res);
						}
					});
					
					setTimeout((v) => {
						uni.navigateTo({
							url: '/pages/public/login',
							success: (res) => {
								console.log(res);
							}
						})
					}, 1000)
				}).catch((err) => {
					console.log(err);
				})
			},
			askVerCode() {
				this.disabled = true
				this.forgetVercolor = '#ccc'
				this.forgetVercoder = '发送中...'

				let timer = null
				let time = 10
				begCode({
					mobile: this.username,
					type: 'login'
				}).then((res) => {
					console.log(res);

					if (res.code == 0) {

						uni.showToast({
							title: '验证码发送成功',
							duration: 2000,
							success: (res) => {
								console.log(res);
							}
						});

						timer = setInterval(() => {
							time--
							this.forgetVercoder = `${time}秒后再次发送`
							if (time <= 0) {
								clearInterval(timer)
								time = 10
								this.disabled = false
								this.forgetVercolor = '#FDDA33'
								this.forgetVercoder = '再次点击发送'
							}
						}, 1000)
					} else {
						uni.showToast({
							title: res.msg,
							duration: 1000,
							fail: (err) => {
								console.log(err);
							}
						});
						this.disabled = false
						this.btnColor = '#FDD100'
						this.sendVercode = '再次点击发送'
					}
				}).catch((err) => {
					console.log(err);
					uni.showToast({
						title: "网络异常",
						duration: 2000,
						fail: (err) => {
							console.log(err);
						}
					});

					this.disabled = false
					this.btnColor = '#FDD100'
					this.sendVercode = '再次点击发送'

				})
			}
		}
	}
</script>
<style lang="scss">
	@import "login.scss"
</style>
