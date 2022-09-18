import { gettingData as http} from '@/utils/request.js'

// 获取用户信息 
export const getUser=(params)=>http({url:'/user/getuserInfo',data:params,method:'POST'})

// 修改用户信息
export const editUserInfo=(params)=>http({url:'/user/editUserInfo',data:params,method:'POST'})

// 获取图片token
export const getQiniuToken = () => http({url:"/upload/token"})

// 上传到七牛云
// export const uploadQiniu = (formdata) =>http({url:"https://upload-z1.qiniup.com",data:formdata,method:'POST',header:{"Content-Type": "multipart/form-data"}});