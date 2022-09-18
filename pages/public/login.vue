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
		<view class="login-phone form-wapper">
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-shouji"></text></view>
				<view class="mobile rside">
					<input placeholder-class="input-placeholder" v-model="username" type="number"
						placeholder="请输入手机号" />
				</view>
			</view>
			<view class="code input-wapper">
				<view class="lside"><text class="iconfont icon-mima2"></text></view>
				<view class="rside">
					<input placeholder-class="input-placeholder" v-model="password" type="password" maxlength="12"
						placeholder="请输入密码(6-12位) " />
				</view>
			</view>
			<view class="paw">
				<view class="btn">验证码登录</view>
			</view>
		</view>

		<button type="primary" class="login-btn" @click="myLogin">登录</button>
		<view class="reg-paw">
			<text class="active">注册账号</text>
			<text>忘记密码</text>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="quick">
			<view class="quick-title">
				<text class="line"></text>
				<text class="txt">快捷登陆</text>
				<text class="line"></text>
			</view>
			<view class="sanfang">
				<image src="../../static/temp/share_wechat.png" mode=""></image>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>
<script>
	import {
		getLogin
	} from '@/utils/API/api.js'
	
	// import {mapMutations} from 'vuex'
	
	export default {
		name: 'login',
		data() {
			return {
				username: '',
				password: ''
			}
		},
		computed:{
		
		},
		methods: {
				// ...mapMutations(['getUserInfo']),
			
			
			myLogin() {
				let {
					password,
					username
				} = this

				getLogin({
					username,
					password
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

						// 保存本地
						let token = res.token
						let tokenExpired = res.tokenExpired
						
						// let uid=res.uid
						this.$store.commit('save',['isLogin',true])

	

						uni.setStorageSync('data',{
							'token': token,
							'tokenExpired': tokenExpired,
							})
				
				
						setTimeout(()=>{
							// 跳转
							uni.switchTab({
								url: '/pages/user/user',
								complete: (res) => {
									console.log(res);
								}
							})
						},1000)
					}
				}).catch((err) => {
					console.log(err);
				})
			}
		}
	}
</script>
<style lang="scss">
	@import "login.scss"
</style>
