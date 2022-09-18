import store from '@/store/index.js'

export default function() {
	return new Promise((resolve, reject) => {
		let data = uni.getStorageSync('data')
		let {
			token,
			tokenExpired
		} = data

		if (token) {
			let now = new Date().getTime()
			if (now > Number(tokenExpired)) {
				setTimeout(() => {
					uni.showToast({
						title: '你的登录已过期,请重新登录',
						duration: 2000,
						success: (res) => {
							console.log(res);
						}
					})
				}, 0);
				uni.removeStorageSync('token')
				uni.removeStorageSync('tokenExpired')

				resolve()
			} else {
				 uni.showLoading({
						title: "加载中"
				   });
			
				store.dispatch('getUserInfo',token).then((res)=>{
					resolve()
					uni.hideLoading();	
				}).catch((err)=>{
					console.log(err);
					reject()
				})
			}
		} else {
			resolve()
		}
	})
}
