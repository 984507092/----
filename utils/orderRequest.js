const baseURL='https://4de16698-d9f4-443a-b416-ef1037cce952.bspapp.com/http'

let token
uni.getStorage({
	key:'data',
	success:(res)=>{
		token=res.data.token
	}
})


 export const gettingData=({url,data={},method='GET'})=>{
		return new Promise((resolve,reject)=>{
		  uni.request({
			   url:baseURL+url,
			   data:data,
			   method:method,
			   header:{
				   'token':token,
				   "platform":'app-plus'||'h5'
			   },
		   success:(res)=>{
				resolve(res.data)
		   },
		   fail:(err)=>{
				reject(err)
		   },
		   complete:(res) =>{
				resolve(res)
				reject(res)
		   }
		})
	})
}


