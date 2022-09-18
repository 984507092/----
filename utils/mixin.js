
		function $date(timeStamp,format){
			if('' + timeStamp.length <= 10){
				timeStamp = + timeStamp * 1000;
			}else{
				timeStamp = + timeStamp;
			}
			let _date = new Date(timeStamp),
				Y = _date.getFullYear(),
				m = _date.getMonth() + 1,
				d = _date.getDate(),
				H = _date.getHours(),
				i = _date.getMinutes(),
				s = _date.getSeconds();
			
			m = m < 10 ? '0' + m : m;
			d = d < 10 ? '0' + d : d;
			H = H < 10 ? '0' + H : H;
			i = i < 10 ? '0' + i : i;
			s = s < 10 ? '0' + s : s;
		
			return format.replace(/[YmdHis]/g, key=>{
				return {Y,m,d,H,i,s}[key];
			});
		}


const mixin = {
	
	data(){
		return {
			
		}
	},
	methods:{
		navTo(url){
			uni.navigateTo({
				url
			})
		},
		back(num){
			if(typeof num ==='object'||!num){
				num = 1
			}
			uni.navigateBack({
				delta:num
			})
		}

	}
	
	
}

export default mixin;