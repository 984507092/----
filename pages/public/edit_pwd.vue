<template>
	<view class="warp">
		<!-- #ifdef APP-PLUS -->
		<view class="title-contents"><view class="top-view status"></view></view>
		<!-- #endif -->
		<view class="login-phone form-wapper">

			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-mima2"></text></view>
				<view class="mobile rside">
					<input placeholder-class="input-placeholder" v-model="oldPassword" type="password"  placeholder="请输入原密码" />

				</view>
			</view>
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-mima2"></text></view>
				<view class="mobile rside">
					<input placeholder-class="input-placeholder" type="password" v-model="newPassword" placeholder="请输入新密码" />
		
				</view>
			</view>
			<view class="phone input-wapper">
				<view class="lside"><text class="iconfont icon-mima2"></text></view>
				<view class="mobile rside">
					<input placeholder-class="input-placeholder" v-model="confirmPass" type="password"  placeholder="请再次输入新密码" />
				
				</view>
			</view>
		</view>

		<button type="primary" class="login-btn" @click="changePass">修改</button>

	</view>
</template>
<script>
	import {updatePwd}  from '@/utils/API/api.js'
	import {romveItem} from '@/utils/accessLocal/accessLocal.js'
	import {mapState} from 'vuex'
	export default{
		name:'updatePwd',
		data(){
			return {
				oldPassword:'',
				newPassword:'',
				confirmPass:''
			}
		},
		onLoad() {
			
		},
		computed:{
			...mapState(['uid'])
		},
		methods:{
			changePass(){
				let {oldPassword,newPassword,confirmPass,uid}=this

				if(oldPassword != newPassword&&confirmPass==newPassword &&oldPassword!=confirmPass){
					updatePwd({oldPassword,newPassword,confirmPass,uid}).then((res)=>{
						console.log(res);
						if(res.code==0){
							uni.showToast({
								title:'修改成功',
								icon:'none'
							})
							
							romveItem('data')
							
							setTimeout((v)=>{
								uni.navigateTo({
									url:'/pages/public/login'
								})
							},800)
						}
					})
				}else{
					uni.showToast({
						title:'你输入的密码有误',
						icon:'none'
					})
				}
			}
		}
	}

</script>
<style lang="scss">
@import  "login.scss"
</style>
