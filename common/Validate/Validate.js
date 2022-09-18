// 验证规则
function getReg(str) {
	let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
	return reg.test(str)
}

// 手机号验证
export const mobileTel = (data) => {
	
	let {
	username,
	telText,
	telColor
	}=data
	
	if (!getReg(username) || username < 11) {
		data.telText = '手机号格式不对'
		data.telColor = 'red'
		// return
	} else {
		data.telText = ''
		data.telColor = ''
	}
	return data
}


// 密码验证
export const passwordReg = (data) => {
			let {
				password,
				passText,
				passTextColor
			}=data
	
		if (password == '' || password < 3) {
			data.passText = '密码输入有误'
			data.passTextColor = 'red'
		} else {
			data.passText = ''
			data.passTextColor = ''
		}
		return data
	}
