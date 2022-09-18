import { gettingData as http} from '@/utils/request.js'

// 商品列表
export const  getGoodList=(params)=>http({url:'/api/get_goods_list',data:params,method:'POST'})

// 商品详情  
export const  getGoodsDetail=(params)=>http({url:'/api/get_goods_detail',data:params,method:'POST'})

// 商品评价  
export const  getGoodsComment=(params)=>http({url:'/api/get_goods_comment',data:params,method:'POST'})

// 购物车数量改变 
export const  changeCartNum=(params)=>http({url:'/api/change_cart_num',data:params,method:'POST'})

// 获取sku   
export const  getSku=(params)=>http({url:'/api/get_sku',data:params,method:'POST'})

// 加入购物车  
export const  addCart=(params)=>http({url:'/api/add_cart',data:params,method:'POST'})

// 购物车列表  /api/get_cart_list
export const  getCartList=(params)=>http({url:'/api/get_cart_list',data:params,method:'POST'})

// 购物车选中 
export const  toggleCheckCart=(params)=>http({url:'/api/check_cart',data:params,method:'POST'})

// 购物车取消
export const cancelCheckCart=(params)=>http({url:'/api/cancel_cart',data:params,method:'POST'})

// 收藏  
export const toggleFav=(params)=>http({url:'/api/toggle_fav',data:params,method:'POST'})

// 移除购物车  
export const removeCart=(params)=>http({url:'/api/remove_cart',data:params,method:'POST'})