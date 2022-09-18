<template>
	<view class="warp" @submit="onSubmit">
		<!-- #ifdef APP-PLUS -->
		<view class="title-contents">
			<view class="top-view status"></view>
		</view>
		<!-- #endif -->
		<view class="login-title">
			<view class="logo">
				<image src="/static/images/common/logo.png" mode=""></image>
			</view>
		</view>
		<!-- 密码登录 -->
		<view class="login-phone form-wapper" ref="regFrom">
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-shouji"></text></view>
				<view class="mobile rside">
					<input @input="telTishi" placeholder-class="input-placeholder" type="number" v-model="username"
						placeholder="请输入手机号" />
					<text v-if="tishi" :style='{color:tishiColor}'>{{tishi}}</text>
				</view>
			</view>
			<view class="phone input-wapper">
				<view class="lside">
					<text class="iconfont icon-yanzhengma"></text>
				</view>
				<view class="mobile rside">
					<input placeholder-class="input-placeholder" type="number" v-model="vercode" placeholder="请输入验证码" />

				</view>

				<view>
					<button :style='{backgroundColor:btnColor}' type="default" @click="getauthCode"
						:disabled="disabled">{{sendVercode}}</button>
				</view>
			</view>
			<view class="code input-wapper">
				<view class="lside">
					<text class="iconfont icon-mima2"></text>
				</view>
				<view class="rside">
					<input @input="mimatishi" placeholder-class="input-placeholder" type="password" maxlength="12"
						v-model="password" placeholder="请输入密码(6-12位) " />
					<text v-if="passTishi" :style='{color:passTishiColor}'>{{passTishi}}</text>
				</view>
			</view>
		</view>

		<button type="primary" class="login-btn" @click="getRegister">注册</button>
		<view class="reg-paw">
			<text class="active" @click="back">已有账号,返回登录</text>
		</view>
	</view>
</template>
<script>
	import {
		gettingReg,
		begCode
	} from '@/utils/API/api.js'
	import {mobileTel,passwordReg} from '@/common/Validate/Validate.js'

	export default {
		name: 'reg',
		data() {
			return {
				username: '',
				password: '',
				vercode: '',
				btnColor: '#FDD100', //发送验证吗按钮
				tishi: '', //手机号
				tishiColor: '', //手机号提示颜色
				passTishi: '', //密码
				passTishiColor: '', //密码提示颜色
				sendVercode: '获取验证码',
				disabled: false
			}
		},

		methods: {
			/* 
						// 验证规则
			 			getReg(str) {
			 				let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
			 				return reg.test(str)
			 			},
			 			 // 手机号验证
			 			mobileTel() {
			 				let {
			 					username
			 				} = this
			 
			 				if (!this.getReg(username) || username < 11) {
			 					this.tishi = '手机号格式不对'
			 					this.tishiColor = 'red'
			 				} else {
			 					this.tishi = ''
			 					this.tishiColor = ''
			 				}
			 			},
						// 密码验证
			 			passwordReg() {
			 				let {
			 					password
			 				} = this
			 				if (password == '' || password < 3) {
			 					this.passTishi = '密码输入有误'
			 					this.passTishiColor = 'red'
			 				} else {
			 					this.passTishi = ''
			 					this.passTishiColor = ''
			 				}
			 			},
			 
			 */
			
			// 手机号
			telTishi() {
				let data = {
					username: this.username,
					telText: this.tishi,
					telColor: this.tishiColor
				}
				this.tishi=mobileTel(data).telText
				this.tishiColor=mobileTel(data).telColor
			},
			
			// 密码
			mimatishi() {
				
				let data = {
					password: this.password,
					passText: this.passTishi,
					passTextColor: this.passTishiColor
				}
				this.passTishi=passwordReg(data).passText
				this.passTishiColor=passwordReg(data).passTextColor
			},

			// 注册
			getRegister() {
				let {
					username,
					password,
					vercode
				} = this

				if (username == '' && password == '') {
					this.tishi = '请输入手机号'
					this.tishiColor = 'red'
					this.passTishi = '请输入密码'
					this.passTishiColor = 'red'
					return
				}


				gettingReg({
					username: username,
					password: password,
					vercode: vercode
				}).then((res) => {
					console.log(res);

					if (res.code == 0) {
						uni.showToast({
							title: '登录成功',
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
					}

				}).catch((err) => {
					console.log(err);
				})
			},

			// 验证码
			getauthCode() {
				let {
					username
				} = this

				this.disabled = true
				this.btnColor = '#ccc'
				this.sendVercode = '发送中...'

				let timer;
				let time = 60
				begCode({
					mobile: this.username,
					type: 'register'
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
							this.sendVercode = `${time}秒后再次发送`
							if (time <= 0) {
								clearInterval(timer)
								time = 60
								this.disabled = false
								this.btnColor = '#FDD100'
								this.sendVercode = '再次点击发送'
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
