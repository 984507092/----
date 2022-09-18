
export function fomatterDate (date) {
	
	if (typeof date === 'number') {
		date = new Date(date)
	}

	if (date instanceof Date) {
		// date = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((v)=>((v + "").length > 1 ? v : "0" + v)).join("/")
		
		date = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
		
		date=date.map((v)=>((v + "").length > 1 ? v : "0" + v)).join("/")
	}
	
		
	if(date==''){
		return "请选择生日"
	}else{
		return date
	}
}


