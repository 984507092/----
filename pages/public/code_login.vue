<template>
	<view class="warp">
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
		<view class="login-phone form-wapper">
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-shouji"></text></view>
				<view class="mobile rside">
					<input placeholder-class="input-placeholder" v-model="username" type="number"
						placeholder="请输入手机号" />
				</view>
			</view>
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-yanzhengma"></text></view>
				<view class="mobile rside">
					<input placeholder-class="input-placeholder" v-model="verification" type="number"
						placeholder="请输入验证码" />
				</view>

				<view>
					<button type="default" :style='{backgroundColor:btnColor}' :disabled="disabled" @click="begVerCode">{{sendVercode}}</button>
				</view>
			</view>
		</view>

		<button type="primary" class="login-btn" @click="codeLogin">登录</button>

	</view>
</template>
<script>
	import { begCode,getCodeLogin } from '@/utils/API/api.js'
	export default {
		name: 'code_login',
		data() {
			return {
				username: '',
				verification: '',
				sendVercode: '获取验证码',
				disabled: false,
				btnColor: '#FDD100', //发送验证吗按钮
			}
		},
		
		onLoad(){
		},
		
		methods: {
			// 登录
			codeLogin() {
				getCodeLogin({
					username: this.username,
					vercode: this.verification
				}).then((res)=>{
					console.log(res);
					if (res.code==0) {
					
					uni.showToast({
						title: '登录成功',
						duration: 500,
						success:(res)=>{
							console.log(res);
						}
					});
					
						// 保存本地
						let token = res.token
						let tokenExpired = res.tokenExpired
						let uid = res.uid
						let userInfo = res.userInfo
					
						uni.setStorageSync({
							'token': token,
							'tokenExpired': tokenExpired,
							'uid': uid,
							'userInfo': userInfo,
							success: (res) => {
								console.log(res);
							},
							fail: (err) => {
								console.log(err);
							},
							complete: (res) => {
								console.log(res);
							}
						})
						// 跳转
						setTimeout(()=>{
							uni.switchTab({
								url: '/pages/user/user',
								complete: (res) => {
									console.log(res);
								}
							})
						},1000)
					}
				}).catch((err)=>{
					console.log(err);
				})
			},
			// 验证码
			begVerCode() {
				this.disabled = true
				this.btnColor = '#ccc'
				this.sendVercode = '发送中...'
			
				let timer;
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
							success:(res)=>{
								console.log(res);
							}
						});
						
						timer = setInterval(() => {
							time--
							this.sendVercode = `${time}秒后再次发送`
							if (time <= 0) {
								clearInterval(timer)
								time = 10
								this.disabled = false
								this.btnColor = '#FDD100'
								this.sendVercode = '再次点击发送'
							}
						}, 1000)
			
					} else {
						uni.showToast({
							title: res.msg,
							duration: 2000,
							fail:(err)=>{
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
						fail:(err)=>{
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
