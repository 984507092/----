import { gettingData as http} from '@/utils/request.js'

// 发送验证码
export const begCode= (params) => {
	return http({
		url:'/user/sendSms',
		data:params,
		method:'POST'
	})
}

// 注册  
export const gettingReg= (params) => http({url:'/user/reg',data:params,method:'POST'})

// 登录 
export const getLogin= (params) => http({url:'/user/login',data:params,method:'POST'})

// 验证码登录
export const getCodeLogin= (params) => http({url:'/user/code_login',data:params,method:'POST'})

// 忘记密码 
export const forget= (params) => http({url:'/user/forget',data:params,method:'POST'})

// 修改密码  
export const updatePwd= (params) => http({url:'/user/updatePwd',data:params,method:'POST'})
